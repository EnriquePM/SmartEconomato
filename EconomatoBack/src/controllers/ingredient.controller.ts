import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const getIngredientes = async (req: Request, res: Response) => {
    try {
        const ingredientes = await prisma.ingrediente.findMany({
            include: {
                categoria: true, 
                proveedor: true  
            }
        });
        res.json(ingredientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ingredientes' });
    }
};

export const createIngrediente = async (req: Request, res: Response) => {
    try {
        // 👇 AÑADIMOS precio_unidad para recogerlo
        const { nombre, imagen, stock, stock_minimo, tipo, id_categoria, id_proveedor, unidad_medida, precio_unidad } = req.body;

        const nuevoIngrediente = await prisma.ingrediente.create({
            data: {
                nombre,
                imagen,
                stock: Number(stock) || 0,
                stock_minimo,
                tipo,
                id_categoria,
                id_proveedor,
                unidad_medida,
                precio_unidad: Number(precio_unidad) || 0 // 👇 SE LO PASAMOS A PRISMA
            }
        });

        res.json(nuevoIngrediente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ingrediente' });
    }
};

export const updateIngrediente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const datos = req.body;

        const actualizado = await prisma.ingrediente.update({
            where: { id_ingrediente: Number(id) },
            data: datos 
        });

        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

export const deleteIngrediente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.ingrediente.delete({
            where: { id_ingrediente: Number(id) }
        })
        res.json({ message: 'Ingrediente eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar ingrediente' })
    }
}