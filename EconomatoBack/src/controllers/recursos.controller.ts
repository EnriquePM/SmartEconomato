import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getCategorias = async (req: Request, res: Response) => {
    try {
        const categorias = await prisma.categoria.findMany();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
};

export const getProveedores = async (req: Request, res: Response) => {
    try {
        const proveedores = await prisma.proveedor.findMany();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener proveedores" });
    }
};