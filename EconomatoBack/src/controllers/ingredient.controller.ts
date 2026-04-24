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

export const getIngredientes = async (_req: Request, res: Response) => {
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

export const createIngrediente = async (req: AuthRequest, res: Response) => {
    try {
        const { nombre, imagen, stock, stock_minimo, tipo, id_categoria, id_proveedor, unidad_medida, precio_unidad, fecha_caducidad, alergenosIds } = req.body;

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
                fecha_caducidad: fecha_caducidad ? new Date(fecha_caducidad) : null,
                alergenos: alergenosIds ? {
                    connect: alergenosIds.map((id: number) => ({ id_alergeno: id }))
                } : undefined
            }
        });

        void logActividad(
            getUserId(req),
            'Creó un producto',
            'ingrediente',
            nuevoIngrediente.id_ingrediente,
            `Producto: ${nombre}`,
            '/inventario'
        );

        res.json(nuevoIngrediente);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ingrediente' });
    }
};

export const updateIngrediente = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { alergenosIds, fecha_caducidad, ...rest } = req.body;

        const dataUpdate: any = { ...rest };
        if ('fecha_caducidad' in req.body) {
            dataUpdate.fecha_caducidad = fecha_caducidad ? new Date(fecha_caducidad) : null;
        }
        if (alergenosIds) {
            dataUpdate.alergenos = {
                set: alergenosIds.map((id: number) => ({ id_alergeno: Number(id) }))
            };
        }

        const actualizado = await prisma.ingrediente.update({
            where: { id_ingrediente: Number(id) },
            data: dataUpdate
        });

        void logActividad(
            getUserId(req),
            'Editó un producto',
            'ingrediente',
            Number(id),
            `Producto: ${actualizado.nombre}`,
            '/inventario'
        );

        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

export const deleteIngrediente = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const ingrediente = await prisma.ingrediente.findUnique({
            where: { id_ingrediente: Number(id) },
            select: { nombre: true }
        });

        await prisma.ingrediente.delete({
            where: { id_ingrediente: Number(id) }
        });

        void logActividad(
            getUserId(req),
            'Eliminó un producto',
            'ingrediente',
            Number(id),
            `Producto: ${ingrediente?.nombre ?? id}`,
            '/inventario'
        );

        res.json({ message: 'Ingrediente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar ingrediente' });
    }
};
