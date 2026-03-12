import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { estado_pedido } from '@prisma/client';

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

// 5. CONFIRMAR PEDIDO (Llegada de mercancía -> Sumar Stock)
export const confirmarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Usamos una transacción para asegurar que se actualiza el estado Y el stock, o nada.
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Obtener los ingredientes del pedido
            const pedido = await tx.pedido.findUnique({
                where: { id_pedido: Number(id) },
                include: { pedido_ingrediente: true }
            });

            if (!pedido) {
                throw new Error('Pedido no encontrado');
            }

            if (pedido.estado === (estado_pedido as any).CONFIRMADO) {
                throw new Error('El pedido ya ha sido confirmado anteriormente');
            }

            // 2. Sumar stock de cada ingrediente
            for (const item of pedido.pedido_ingrediente) {
                await tx.ingrediente.update({
                    where: { id_ingrediente: item.id_ingrediente },
                    data: {
                        stock: {
                            increment: item.cantidad_solicitada
                        }
                    }
                });
            }

            // 3. Actualizar estado del pedido
            return await tx.pedido.update({
                where: { id_pedido: Number(id) },
                data: { estado: (estado_pedido as any).CONFIRMADO }
            });
        });

        res.json(resultado);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error al confirmar el pedido' });
    }
};
