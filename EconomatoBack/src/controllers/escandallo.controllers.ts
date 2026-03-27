import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getEscandallos = async (req: Request, res: Response): Promise<void> => {
  try {
    const escandallos = await prisma.escandallo.findMany({
      include: {
        receta: true, // Datos básicos de la receta a la que pertenece
        usuario: {
          select: {
            nombre: true,
            apellido1: true
          }
        },
        escandallo_detalle: {
          include: {
            ingrediente: true
          }
        }
      },
      orderBy: { fecha_creacion: 'desc' }
    });
    res.json(escandallos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los escandallos' });
  }
};

export const createEscandallo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_receta, id_usuario, descripcion } = req.body;
    
    if (!id_receta || !id_usuario) {
      res.status(400).json({ error: 'La receta y el usuario son obligatorios' });
      return;
    }

    // Usaremos transacción para asegurar que el escandallo coge una 'foto fija' de la receta
    const nuevoEscandallo = await prisma.$transaction(async (tx) => {
      // 1. Verificar receta
      const receta = await tx.receta.findUnique({
        where: { id_receta },
        include: { receta_ingrediente: true }
      });

      if (!receta) {
        throw new Error('Receta no encontrada');
      }

      if (receta.receta_ingrediente.length === 0) {
        throw new Error('No se puede escandallar una receta sin ingredientes');
      }

      // 2. Crear cabecera Escandallo
      const escandallo = await tx.escandallo.create({
        data: {
          id_receta,
          id_usuario,
          descripcion
        }
      });

      // 3. Crear los detalles (copia de la receta_ingrediente actual)
      const detallesData = receta.receta_ingrediente.map(ing => ({
        id_escandallo: escandallo.id_escandallo,
        id_usuario: id_usuario, // PK compuesta requiere el usuario
        id_ingrediente: ing.id_ingrediente
      }));

      await tx.escandallo_detalle.createMany({
        data: detallesData
      });

      return escandallo;
    });

    res.status(201).json(nuevoEscandallo);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al crear el escandallo' });
  }
};

export const getEscandalloById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const escandallo = await prisma.escandallo.findUnique({
      where: { id_escandallo: Number(id) },
      include: {
        receta: true,
        escandallo_detalle: {
          include: { ingrediente: true }
        }
      }
    });

    if (!escandallo) {
      res.status(404).json({ error: 'Escandallo no encontrado' });
      return;
    }
    
    res.json(escandallo);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el escandallo' });
  }
};

export const deleteEscandallo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.escandallo.delete({
      where: { id_escandallo: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el escandallo' });
  }
};
