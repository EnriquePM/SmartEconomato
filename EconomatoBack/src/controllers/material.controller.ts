import { Request, Response } from 'express';
import { prisma } from '../prisma';

// 1. OBTENER TODOS LOS MATERIALES
export const getMateriales = async (req: Request, res: Response) => {
    try {
        const materiales = await prisma.material.findMany({
            include: {
                categoria: true // Incluimos el nombre de la categoría
            }
        });
        res.json(materiales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener materiales' });
    }
};

// 2. CREAR UN MATERIAL (Solo Profesores/Admin)
export const createMaterial = async (req: Request, res: Response) => {
    try {
        const { nombre, unidad_medida, precio_unidad, id_categoria, stock } = req.body;

        if (!nombre || !id_categoria) {
            res.status(400).json({ error: 'Nombre y Categoría son obligatorios' });
            return;
        }

        const nuevoMaterial = await prisma.material.create({
            data: {
                nombre,
                unidad_medida,
                precio_unidad: precio_unidad || 0,
                id_categoria: Number(id_categoria),
                stock: stock ? Number(stock) : 0
            }
        });

        res.json(nuevoMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear material' });
    }
};

// 3. MODIFICAR MATERIAL (Solo Profesores/Admin)
export const updateMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        const actualizado = await prisma.material.update({
            where: { id_material: Number(id) },
            data: {
                ...datos,
                id_categoria: datos.id_categoria ? Number(datos.id_categoria) : undefined
            }
        });

        res.json(actualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar material' });
    }
};

// 4. ELIMINAR MATERIAL (Solo Profesores/Admin)
export const deleteMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.material.delete({
            where: { id_material: Number(id) }
        });
        res.json({ message: 'Material eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar material' });
    }
};
