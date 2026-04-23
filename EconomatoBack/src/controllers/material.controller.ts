import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAction } from '../services/audit.service';

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
        const { nombre, unidad_medida, precio_unidad, id_categoria, stock, stock_minimo } = req.body;
        const nombreNormalizado = typeof nombre === 'string' ? nombre.trim() : '';
        const categoriaId = Number(id_categoria);

        if (!nombreNormalizado || !Number.isInteger(categoriaId) || categoriaId <= 0) {
            res.status(400).json({ error: 'Nombre y Categoría son obligatorios' });
            return;
        }

        const categoriaExiste = await prisma.categoria.findUnique({
            where: { id_categoria: categoriaId },
            select: { id_categoria: true }
        });

        if (!categoriaExiste) {
            res.status(400).json({ error: 'La categoría seleccionada no existe' });
            return;
        }

        const nuevoMaterial = await prisma.material.create({
            data: {
                nombre: nombreNormalizado,
                unidad_medida,
                precio_unidad: precio_unidad || 0,
                stock: Number(stock) || 0,
                stock_minimo: Number(stock_minimo) || 0,
                id_categoria: categoriaId
            }
        });

        void logAction((req as any).user?.id ?? null, 'CREATE', 'Material', nuevoMaterial.id_material, { nombre: nuevoMaterial.nombre });
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

        void logAction((req as any).user?.id ?? null, 'UPDATE', 'Material', Number(id), { nombre: actualizado.nombre });
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
        const existente = await prisma.material.findUnique({
            where: { id_material: Number(id) },
            select: { nombre: true }
        });
        await prisma.material.delete({ where: { id_material: Number(id) } });
        void logAction((req as any).user?.id ?? null, 'DELETE', 'Material', Number(id), { nombre: existente?.nombre });
        res.json({ message: 'Material eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar material' });
    }
};
