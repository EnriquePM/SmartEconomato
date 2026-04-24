import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getActividades = async (req: Request, res: Response) => {
  try {
    const actividades = await prisma.registro_actividad.findMany({
      orderBy: { fecha: 'desc' },
      take: 500
    });
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
};
