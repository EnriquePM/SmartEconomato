import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logActividad } from '../services/actividadLog.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id?: number | string;
    id_usuario?: number | string;
    role?: string;
  };
}

type IngredientePayload = {
  id_ingrediente: number;
  cantidad: number;
  rendimiento: number;
};

const RECETA_NOMBRE_MAX = 255;

const parseRecetaId = (id: unknown): number | null => {
  if (Array.isArray(id) || typeof id !== 'string') {
    return null;
  }

  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const normalizeIngredientesPayload = (body: any): { data?: IngredientePayload[]; error?: string } => {
  const source = Array.isArray(body.ingredientes)
    ? body.ingredientes
    : Array.isArray(body.receta_ingrediente)
      ? body.receta_ingrediente
      : null;

  if (!source) {
    return { error: 'Debes enviar ingredientes o receta_ingrediente con al menos un ingrediente' };
  }

  if (source.length === 0) {
    return { error: 'La receta debe incluir al menos un ingrediente' };
  }

  const normalized: IngredientePayload[] = [];

  for (const item of source) {
    const idIngrediente = Number(item?.id_ingrediente);
    const cantidad = Number(item?.cantidad);
    const rendimiento = item?.rendimiento !== undefined ? Number(item.rendimiento) : 100;

    if (!Number.isInteger(idIngrediente) || idIngrediente <= 0) {
      return { error: 'Cada ingrediente debe tener un id_ingrediente valido' };
    }

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return { error: 'Cada ingrediente debe tener una cantidad numerica mayor que 0' };
    }

    if (!Number.isFinite(rendimiento) || rendimiento <= 0) {
      return { error: 'El rendimiento debe ser un numero mayor que 0' };
    }

    normalized.push({
      id_ingrediente: idIngrediente,
      cantidad,
      rendimiento
    });
  }

  return { data: normalized };
};

export const getRecetas = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recetas = await prisma.receta.findMany({
      include: {
        receta_ingrediente: {
          include: {
            ingrediente: true // Para devolver el nombre y datos del ingrediente además de la cantidad
          }
        },
        receta_alergeno: {
          include: { alergeno: true }
        },
        escandallo: true // Traemos también si tiene escandallos asociados
      },
      orderBy: { fecha_creacion: 'desc' }
    });
    res.json(recetas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las recetas' });
  }
};

export const createReceta = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawNombre = req.body.nombre;
    const rawDescripcion = req.body.descripcion;
    const { cantidad_platos } = req.body;
    const normalizedIngredientes = normalizeIngredientesPayload(req.body);

    const nombre = typeof rawNombre === 'string' ? rawNombre.trim() : '';
    const descripcion =
      rawDescripcion === undefined || rawDescripcion === null
        ? null
        : typeof rawDescripcion === 'string'
          ? rawDescripcion.trim()
          : null;

    if (!nombre) {
      res.status(400).json({ error: 'El nombre y al menos un ingrediente son obligatorios' });
      return;
    }

    if (nombre.length > RECETA_NOMBRE_MAX) {
      res.status(400).json({ error: `El nombre no puede superar ${RECETA_NOMBRE_MAX} caracteres` });
      return;
    }

    if (rawDescripcion !== undefined && rawDescripcion !== null && typeof rawDescripcion !== 'string') {
      res.status(400).json({ error: 'La descripcion debe ser un texto valido' });
      return;
    }

    if (normalizedIngredientes.error || !normalizedIngredientes.data) {
      res.status(400).json({ error: normalizedIngredientes.error || 'Ingredientes invalidos' });
      return;
    }

    const ingredientesNormalizados = normalizedIngredientes.data;

    // Usamos transacción para asegurar que se crea la receta y TODOS sus ingredientes, o nada.
    const nuevaReceta = await prisma.$transaction(async (tx) => {
      // 1. Crear la Receta
      const receta = await tx.receta.create({
        data: {
          nombre,
          descripcion,
          cantidad_platos
        }
      });

      // 2. Preparar los datos para receta_ingrediente
      const ingredientesData = ingredientesNormalizados.map((ing) => ({
        id_receta: receta.id_receta,
        id_ingrediente: ing.id_ingrediente,
        cantidad: ing.cantidad,
        rendimiento: ing.rendimiento || 100 // Por defecto 100% de rendimiento
      }));

      // 3. Crear las asociones
      await tx.receta_ingrediente.createMany({
        data: ingredientesData
      });

      // 4. Crear las asociones de alérgenos
      if (Array.isArray(req.body.alergenos) && req.body.alergenos.length > 0) {
        // Asume que alergenos son strings o números, los casteamos a número por seguridad
        const alergenoIds = req.body.alergenos.map(Number).filter((id: number) => !isNaN(id));
        if (alergenoIds.length > 0) {
          const alergenosData = alergenoIds.map((idAlergeno: number) => ({
            id_receta: receta.id_receta,
            id_alergeno: idAlergeno
          }));
          await tx.receta_alergeno.createMany({
            data: alergenosData
          });
        }
      }

      const recetaCompleta = await tx.receta.findUnique({
        where: { id_receta: receta.id_receta },
        include: {
          receta_ingrediente: {
            include: { ingrediente: true }
          },
          receta_alergeno: {
            include: { alergeno: true }
          },
          escandallo: true
        }
      });

      return recetaCompleta;
    });

    if (nuevaReceta) {
      const idUsuario = (req as AuthenticatedRequest).user?.id ?? (req as AuthenticatedRequest).user?.id_usuario;
      void logActividad(
        idUsuario ? Number(idUsuario) : null,
        'Creó una receta',
        'receta',
        nuevaReceta.id_receta,
        `Receta: ${nombre}`,
        '/recetas'
      );
    }

    res.status(201).json(nuevaReceta);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al crear la receta' });
  }
};

export const getRecetaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recetaId = parseRecetaId(id);

    if (!recetaId) {
      res.status(400).json({ error: 'ID de receta invalido' });
      return;
    }

    const receta = await prisma.receta.findUnique({
      where: { id_receta: recetaId },
      include: {
        receta_ingrediente: {
          include: { ingrediente: true }
        },
        receta_alergeno: {
          include: { alergeno: true }
        }
      }
    });

    if (!receta) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }

    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la receta' });
  }
};

export const updateReceta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recetaId = parseRecetaId(id);

    if (!recetaId) {
      res.status(400).json({ error: 'ID de receta invalido' });
      return;
    }

    const recetaExistente = await prisma.receta.findUnique({
      where: { id_receta: recetaId }
    });

    if (!recetaExistente) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }

    const hasIngredientesPayload = Array.isArray(req.body.ingredientes) || Array.isArray(req.body.receta_ingrediente);
    const normalizedIngredientes = hasIngredientesPayload
      ? normalizeIngredientesPayload(req.body)
      : { data: undefined as IngredientePayload[] | undefined, error: undefined as string | undefined };

    if (normalizedIngredientes.error) {
      res.status(400).json({ error: normalizedIngredientes.error });
      return;
    }

    const dataToUpdate: { nombre?: string; descripcion?: string | null; cantidad_platos?: number | null } = {};

    if (req.body.nombre !== undefined) {
      if (typeof req.body.nombre !== 'string' || !req.body.nombre.trim()) {
        res.status(400).json({ error: 'El nombre no puede estar vacio' });
        return;
      }
      const trimmedNombre = req.body.nombre.trim();
      if (trimmedNombre.length > RECETA_NOMBRE_MAX) {
        res.status(400).json({ error: `El nombre no puede superar ${RECETA_NOMBRE_MAX} caracteres` });
        return;
      }
      dataToUpdate.nombre = trimmedNombre;
    }

    if (req.body.descripcion !== undefined) {
      if (req.body.descripcion !== null && typeof req.body.descripcion !== 'string') {
        res.status(400).json({ error: 'La descripcion debe ser un texto valido' });
        return;
      }
      dataToUpdate.descripcion = req.body.descripcion === null ? null : req.body.descripcion.trim();
    }

    if (req.body.cantidad_platos !== undefined) {
      const cantidadPlatos = Number(req.body.cantidad_platos);
      if (!Number.isInteger(cantidadPlatos) || cantidadPlatos <= 0) {
        res.status(400).json({ error: 'cantidad_platos debe ser un entero mayor que 0' });
        return;
      }
      dataToUpdate.cantidad_platos = cantidadPlatos;
    }

    if (Object.keys(dataToUpdate).length === 0 && !hasIngredientesPayload) {
      res.status(400).json({ error: 'No hay datos para actualizar' });
      return;
    }

    const recetaActualizada = await prisma.$transaction(async (tx) => {
      if (Object.keys(dataToUpdate).length > 0) {
        await tx.receta.update({
          where: { id_receta: recetaId },
          data: dataToUpdate
        });
      }

      if (normalizedIngredientes.data) {
        await tx.receta_ingrediente.deleteMany({
          where: { id_receta: recetaId }
        });

        await tx.receta_ingrediente.createMany({
          data: normalizedIngredientes.data.map((ing) => ({
            id_receta: recetaId,
            id_ingrediente: ing.id_ingrediente,
            cantidad: ing.cantidad,
            rendimiento: ing.rendimiento
          }))
        });
      }

      if (req.body.alergenos !== undefined) {
        await tx.receta_alergeno.deleteMany({
          where: { id_receta: recetaId }
        });

        if (Array.isArray(req.body.alergenos) && req.body.alergenos.length > 0) {
          const alergenoIds = req.body.alergenos.map(Number).filter((id: number) => !isNaN(id));
          if (alergenoIds.length > 0) {
            const alergenosData = alergenoIds.map((idAlergeno: number) => ({
              id_receta: recetaId,
              id_alergeno: idAlergeno
            }));
            await tx.receta_alergeno.createMany({
              data: alergenosData
            });
          }
        }
      }

      const recetaCompleta = await tx.receta.findUnique({
        where: { id_receta: recetaId },
        include: {
          receta_ingrediente: {
            include: { ingrediente: true }
          },
          receta_alergeno: {
            include: { alergeno: true }
          },
          escandallo: true
        }
      });

      return recetaCompleta;
    });

    if (recetaActualizada) {
      const idUsuario = (req as AuthenticatedRequest).user?.id ?? (req as AuthenticatedRequest).user?.id_usuario;
      void logActividad(
        idUsuario ? Number(idUsuario) : null,
        'Editó una receta',
        'receta',
        recetaId,
        `Receta: ${recetaActualizada.nombre}`,
        '/recetas'
      );
    }

    res.json(recetaActualizada);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al actualizar la receta' });
  }
};

export const deleteReceta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recetaId = parseRecetaId(id);

    if (!recetaId) {
      res.status(400).json({ error: 'ID de receta invalido' });
      return;
    }

    // Por el OnDelete: Cascade que configuramos en Prisma, 
    // borrar la receta borrará automáticamente las filas en receta_ingrediente
    const recetaAEliminar = await prisma.receta.findUnique({
      where: { id_receta: recetaId },
      select: { nombre: true }
    });

    await prisma.receta.delete({
      where: { id_receta: recetaId }
    });

    const idUsuario = (req as AuthenticatedRequest).user?.id ?? (req as AuthenticatedRequest).user?.id_usuario;
    void logActividad(
      idUsuario ? Number(idUsuario) : null,
      'Eliminó una receta',
      'receta',
      recetaId,
      `Receta: ${recetaAEliminar?.nombre ?? recetaId}`,
      '/recetas'
    );

    res.status(204).send();
  } catch (error: any) {
    if (error?.code === 'P2025') {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }

    res.status(500).json({ error: 'Error al eliminar la receta' });
  }
};

export const makeReceta = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const recetaId = parseRecetaId(req.params.id);
    if (!recetaId) {
      res.status(400).json({ error: 'ID de receta invalido' });
      return;
    }

    const idUsuarioRaw = req.user?.id ?? req.user?.id_usuario;
    const idUsuario = Number(idUsuarioRaw);
    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const receta = await prisma.receta.findUnique({
      where: { id_receta: recetaId },
      include: {
        receta_ingrediente: {
          include: {
            ingrediente: {
              select: {
                id_ingrediente: true,
                nombre: true,
                stock: true,
                unidad_medida: true
              }
            }
          }
        }
      }
    });

    if (!receta) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }

    if (!receta.receta_ingrediente.length) {
      res.status(400).json({ error: 'La receta no tiene ingredientes asociados' });
      return;
    }

    const racionesInput = req.body?.raciones !== undefined ? Number(req.body.raciones) : Number(receta.cantidad_platos || 1);
    if (!Number.isFinite(racionesInput) || racionesInput <= 0) {
      res.status(400).json({ error: 'Las raciones deben ser un numero mayor que 0' });
      return;
    }

    const platosBase = Number(receta.cantidad_platos || 1);
    const factorRaciones = racionesInput / platosBase;

    const faltantes: Array<{
      id_ingrediente: number;
      nombre: string;
      unidad_medida: string;
      necesaria: number;
      disponible: number;
    }> = [];

    const consumos = receta.receta_ingrediente.map((ri) => {
      const rendimiento = Number(ri.rendimiento || 100);
      const rendimientoFactor = rendimiento > 0 ? rendimiento / 100 : 1;
      const cantidadBase = Number(ri.cantidad);
      const necesaria = cantidadBase * factorRaciones / rendimientoFactor;
      const disponible = Number(ri.ingrediente.stock || 0);

      if (disponible < necesaria) {
        faltantes.push({
          id_ingrediente: ri.id_ingrediente,
          nombre: ri.ingrediente.nombre,
          unidad_medida: ri.ingrediente.unidad_medida || 'ud',
          necesaria,
          disponible
        });
      }

      return {
        id_ingrediente: ri.id_ingrediente,
        nombre: ri.ingrediente.nombre,
        unidad_medida: ri.ingrediente.unidad_medida || 'ud',
        necesaria
      };
    });

    if (faltantes.length > 0) {
      res.status(409).json({
        error: 'Stock insuficiente para elaborar la receta',
        faltantes
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      for (const consumo of consumos) {
        const ingredienteActual = await tx.ingrediente.findUnique({
          where: { id_ingrediente: consumo.id_ingrediente },
          select: { stock: true }
        });

        const stockActual = Number(ingredienteActual?.stock || 0);
        const nuevoStock = stockActual - consumo.necesaria;

        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para ${consumo.nombre}`);
        }

        await tx.ingrediente.update({
          where: { id_ingrediente: consumo.id_ingrediente },
          data: { stock: nuevoStock }
        });

        await tx.movimiento.create({
          data: {
            id_ingrediente: consumo.id_ingrediente,
            id_usuario: idUsuario,
            tipo_movimiento: 'SALIDA',
            cantidad: consumo.necesaria,
            observaciones: `Elaboracion de receta #${recetaId} (${receta.nombre}) para ${racionesInput} raciones`
          }
        });
      }
    });

    void logActividad(
      idUsuario,
      'Elaboró una receta',
      'receta',
      recetaId,
      `Receta: ${receta.nombre} (${racionesInput} raciones)`,
      '/recetas'
    );

    res.json({
      mensaje: 'Receta elaborada y stock descontado correctamente',
      id_receta: recetaId,
      raciones: racionesInput
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al elaborar la receta' });
  }
};
