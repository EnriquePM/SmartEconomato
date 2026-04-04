import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getAlergenos = async (req: Request, res: Response) => {
    try {
        const alergenos = await prisma.alergeno.findMany();
        res.json(alergenos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener alérgenos' });
    }
};
