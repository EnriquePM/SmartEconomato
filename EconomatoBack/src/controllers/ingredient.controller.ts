import { Request, Response } from 'express';
import { prisma } from '../prisma';

// 1. OBTENER TODOS LOS PRODUCTOS
export const getIngredientes = async (req: Request, res: Response) => {
    try {
        const ingredientes = await prisma.ingrediente.findMany({
            include: {
                categoria: true, // Incluimos el nombre de la categoría
                proveedor: true  // Incluimos el nombre del proveedor
            }
        });
        res.json(ingredientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ingredientes' });
    }
};

// 2. CREAR UN PRODUCTO
export const createIngrediente = async (req: Request, res: Response) => {
    try {
        const { nombre, imagen, stock, stock_minimo, tipo, id_categoria, id_proveedor } = req.body;

        // Prisma nos autocompleta los campos basados en tu tabla SQL
        const nuevoIngrediente = await prisma.ingrediente.create({
            data: {
                nombre,
                imagen,
                stock: Number(stock) || 0,
                stock_minimo,
                tipo,
                id_categoria,
                id_proveedor
            }
        });

        res.json(nuevoIngrediente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ingrediente' });
    }
};

// 3. MODIFICAR PRODUCTO
export const updateIngrediente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // ID viene de la URL
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