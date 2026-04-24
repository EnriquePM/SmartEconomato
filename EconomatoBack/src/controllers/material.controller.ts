import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logActividad } from '../services/actividadLog.service';

interface AuthRequest extends Request {
  user?: { id_usuario?: number; id?: number };
}

const getUserId = (req: AuthRequest): number | null => {
  const raw = req.user?.id_usuario ?? req.user?.id;
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const getMateriales = async (_req: Request, res: Response) => {
    try {
        const materiales = await prisma.material.findMany({
            include: { categoria: true }
        });
        res.json(materiales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener materiales' });
    }
};

export const createMaterial = async (req: AuthRequest, res: Response) => {
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

        void logActividad(
            getUserId(req),
            'Creó un utensilio',
            'material',
            nuevoMaterial.id_material,
            `Utensilio: ${nombreNormalizado}`,
            '/inventario'
        );

        res.json(nuevoMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear material' });
    }
};

export const updateMaterial = async (req: AuthRequest, res: Response) => {
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

        void logActividad(
            getUserId(req),
            'Editó un utensilio',
            'material',
            Number(id),
            `Utensilio: ${actualizado.nombre}`,
            '/inventario'
        );

        res.json(actualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar material' });
    }
};

export const deleteMaterial = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const material = await prisma.material.findUnique({
            where: { id_material: Number(id) },
            select: { nombre: true }
        });

        await prisma.material.delete({
            where: { id_material: Number(id) }
        });

        void logActividad(
            getUserId(req),
            'Eliminó un utensilio',
            'material',
            Number(id),
            `Utensilio: ${material?.nombre ?? id}`,
            '/inventario'
        );

        res.json({ message: 'Material eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar material' });
    }
};
