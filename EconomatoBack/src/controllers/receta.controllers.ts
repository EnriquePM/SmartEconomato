import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getRecetas = async (req: Request, res: Response): Promise<void> => {
  try {
    const recetas = await prisma.receta.findMany({
      include: {
        receta_ingrediente: {
          include: {
            ingrediente: true // Para devolver el nombre y datos del ingrediente además de la cantidad
          }
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
    const { nombre, descripcion, cantidad_platos, ingredientes } = req.body;
    
    if (!nombre || !ingredientes || !Array.isArray(ingredientes) || ingredientes.length === 0) {
      res.status(400).json({ error: 'El nombre y al menos un ingrediente son obligatorios' });
      return;
    }

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
      const ingredientesData = ingredientes.map((ing: any) => ({
        id_receta: receta.id_receta,
        id_ingrediente: ing.id_ingrediente,
        cantidad: ing.cantidad,
        rendimiento: ing.rendimiento || 100 // Por defecto 100% de rendimiento
      }));

      // 3. Crear las asociones
      await tx.receta_ingrediente.createMany({
        data: ingredientesData
      });

      return receta;
    });

    res.status(201).json(nuevaReceta);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al crear la receta' });
  }
};

export const getRecetaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const receta = await prisma.receta.findUnique({
      where: { id_receta: Number(id) },
      include: {
        receta_ingrediente: {
          include: { ingrediente: true }
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

export const deleteReceta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Por el OnDelete: Cascade que configuramos en Prisma, 
    // borrar la receta borrará automáticamente las filas en receta_ingrediente
    await prisma.receta.delete({
      where: { id_receta: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la receta' });
  }
};
