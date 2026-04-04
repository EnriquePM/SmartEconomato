import { Request, Response } from 'express';
import { prisma } from '../prisma';

// 1. OBTENER TODOS LOS PRODUCTOS
export const getIngredientes = async (req: Request, res: Response) => {
    try {
        const ingredientes = await prisma.ingrediente.findMany({
            include: {
                categoria: true, // Incluimos el nombre de la categoría
                proveedor: true, // Incluimos el nombre del proveedor
                alergenos: true  // Incluimos alérgenos
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
        const { nombre, imagen, stock, stock_minimo, tipo, id_categoria, id_proveedor, alergenosIds } = req.body;

        // Prisma nos autocompleta los campos basados en tu tabla SQL
        const nuevoIngrediente = await prisma.ingrediente.create({
            data: {
                nombre,
                imagen,
                stock: Number(stock) || 0,
                stock_minimo,
                tipo,
                id_categoria,
                id_proveedor,
                alergenos: alergenosIds && alergenosIds.length > 0 ? {
                    connect: alergenosIds.map((id: number) => ({ id_alergeno: id }))
                } : undefined
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
        const { alergenosIds, ...datos } = req.body;

        const updateData: any = { ...datos };

        if (alergenosIds !== undefined) {
             updateData.alergenos = {
                 set: alergenosIds.map((alergenoId: number) => ({ id_alergeno: alergenoId }))
             };
        }

        const actualizado = await prisma.ingrediente.update({
            where: { id_ingrediente: Number(id) },
            data: updateData
        });

        res.json(actualizado);
    } catch (error) {
        console.error(error);
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