import { Request, Response } from 'express';
import { prisma } from '../prisma';

// 1. CREAR PEDIDO (Cualquier usuario autenticado)
export const createPedido = async (req: any, res: Response) => {
    const { ingredientes } = req.body; // Array de { id_ingrediente, cantidad }
    const id_usuario = req.user.id_usuario;

    if (!ingredientes || !Array.isArray(ingredientes) || ingredientes.length === 0) {
        res.status(400).json({ error: 'La lista de ingredientes es obligatoria' });
        return;
    }

    try {
        const nuevoPedido = await prisma.pedido.create({
            data: {
                id_usuario,
                // estado: 'PENDIENTE' (Por defecto en schema)
                pedido_ingrediente: {
                    create: ingredientes.map((ing: any) => ({
                        id_ingrediente: ing.id_ingrediente,
                        cantidad_solicitada: ing.cantidad
                    }))
                }
            },
            include: {
                pedido_ingrediente: {
                    include: { ingrediente: true }
                }
            }
        });

        res.json(nuevoPedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
};

// 2. LISTAR PEDIDOS PENDIENTES (Solo Profesores/Admin)
export const getPedidosPendientes = async (req: Request, res: Response) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            where: {
                estado: 'PENDIENTE'
            },
            include: {
                usuario: {
                    select: { nombre: true, apellido1: true, email: true }
                },
                pedido_ingrediente: {
                    include: {
                        ingrediente: true
                    }
                }
            },
            orderBy: {
                fecha_pedido: 'desc'
            }
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

// 3. VALIDAR PEDIDO (Solo Profesores/Admin)
export const validarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pedidoValidado = await prisma.pedido.update({
            where: { id_pedido: Number(id) },
            data: { estado: 'VALIDADO' }
        });
        res.json(pedidoValidado);
    } catch (error) {
        res.status(500).json({ error: 'Error al validar el pedido' });
    }
};

// 4. BORRAR PEDIDO (Solo Profesores/Admin - "Si están mal lo quiten")
export const deletePedido = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.pedido.delete({
            where: { id_pedido: Number(id) }
        });
        res.json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
};
