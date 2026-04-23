import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAction } from '../services/audit.service';

export const getIngredientes = async (req: Request, res: Response) => {
    try {
        const ingredientes = await prisma.ingrediente.findMany({
            include: {
                categoria: true, 
                proveedor: true,
                alergenos: true
            }
        });
        res.json(ingredientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ingredientes' });
    }
};

export const createIngrediente = async (req: Request, res: Response) => {
    try {
        // 👇 AÑADIMOS precio_unidad para recogerlo y alergenosIds
        const { nombre, imagen, stock, stock_minimo, tipo, id_categoria, id_proveedor, unidad_medida, precio_unidad, alergenosIds } = req.body;

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
                precio_unidad: Number(precio_unidad) || 0,
                alergenos: alergenosIds ? {
                    connect: alergenosIds.map((id: number) => ({ id_alergeno: id }))
                } : undefined
            }
        });

        void logAction((req as any).user?.id ?? null, 'CREATE', 'Ingrediente', nuevoIngrediente.id_ingrediente, { nombre: nuevoIngrediente.nombre });
        res.json(nuevoIngrediente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ingrediente' });
    }
};

export const updateIngrediente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const { alergenosIds, ...rest } = req.body;

        const dataUpdate: any = { ...rest };
        if (alergenosIds) {
            dataUpdate.alergenos = {
                set: alergenosIds.map((id: number) => ({ id_alergeno: Number(id) }))
            };
        }

        const actualizado = await prisma.ingrediente.update({
            where: { id_ingrediente: Number(id) },
            data: dataUpdate
        });

        void logAction((req as any).user?.id ?? null, 'UPDATE', 'Ingrediente', Number(id), { nombre: actualizado.nombre, cambios: rest });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

export const deleteIngrediente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existente = await prisma.ingrediente.findUnique({
            where: { id_ingrediente: Number(id) },
            select: { nombre: true }
        });
        await prisma.ingrediente.delete({ where: { id_ingrediente: Number(id) } });
        void logAction((req as any).user?.id ?? null, 'DELETE', 'Ingrediente', Number(id), { nombre: existente?.nombre });
        res.json({ message: 'Ingrediente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar ingrediente' })
    }
}