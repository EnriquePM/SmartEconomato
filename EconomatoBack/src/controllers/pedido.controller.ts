import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { estado_pedido } from '@prisma/client';

// 1. CREAR O ACTUALIZAR PEDIDO (Soporta Ingredientes y Materiales)
export const createPedido = async (req: any, res: Response) => {


    // Verificamos el usuario
    const id_usuario = req.user ? req.user.id_usuario : 1;

    const {
        proveedor, lineas, total, observaciones, tipoPedido, estado
    } = req.body;

    try {

        // Mapeo manual para debuggear
        const estadoFinal = estado === 'BORRADOR' ? estado_pedido.BORRADOR : estado_pedido.PENDIENTE;
        console.log("5. Estado final calculado:", estadoFinal);

        const dataPedido: any = {
            id_usuario,
            fecha_pedido: new Date(),
            estado: estadoFinal,
            proveedor,
            observaciones,
            total_estimado: total,
            tipo_pedido: tipoPedido
        };


        if (lineas && lineas.length > 0) {
            if (tipoPedido === 'utensilios') {
                dataPedido.pedido_material = {
                    create: lineas.map((l: any) => ({
                        id_material: Number(l.productoId), // Forzamos número
                        cantidad_solicitada: Number(l.cantidad)
                    }))
                };
            } else {
                dataPedido.pedido_ingrediente = {
                    create: lineas.map((l: any) => ({
                        id_ingrediente: Number(l.productoId), // Forzamos número
                        cantidad_solicitada: Number(l.cantidad)
                    }))
                };
            }
        }

        const nuevoPedido = await prisma.pedido.create({
            data: dataPedido
        });

        res.json(nuevoPedido);

    } catch (error) {
        // Esto nos dirá exactamente por qué falla la BD
        res.status(500).json({ error: 'Error al guardar el pedido', detalle: error });
    }
};

// 2. LISTAR TODOS LOS PEDIDOS (Para la tabla del frontend)
export const getPedidos = async (req: Request, res: Response) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            // Quitamos el 'where: PENDIENTE' para que se vean también los borradores y validados
            include: {
                usuario: {
                    select: { nombre: true, apellido1: true, email: true }
                },
                // Incluimos ingredientes...
                pedido_ingrediente: {
                    include: { ingrediente: true }
                },
                // ... Y TAMBIÉN materiales
                pedido_material: {
                    include: { material: true }
                }
            },
            orderBy: {
                fecha_pedido: 'desc'
            }
        });
        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

// 3. VALIDAR PEDIDO
export const validarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const pedidoValidado = await prisma.pedido.update({
            where: { id_pedido: Number(id) },
            data: { estado: estado_pedido.VALIDADO }
        });
        res.json(pedidoValidado);
    } catch (error) {
        res.status(500).json({ error: 'Error al validar el pedido' });
    }
};

// 4. BORRAR PEDIDO
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

// 5. CONFIRMAR PEDIDO (Recepción de mercancía -> Sumar Stock)
export const confirmarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { lineasRecibidas } = req.body;

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Obtener el pedido
            const pedido = await tx.pedido.findUnique({
                where: { id_pedido: Number(id) },
                include: {
                    pedido_ingrediente: true,
                    pedido_material: true
                }
            });

            if (!pedido) throw new Error('Pedido no encontrado');
            if (pedido.estado === estado_pedido.CONFIRMADO) {
                throw new Error('El pedido ya ha sido confirmado completamente');
            }

            let pedidoCompletado = true; // Asumimos que se completará hasta que veamos que falta algo

            // 2A. Procesar Ingredientes
            if (pedido.pedido_ingrediente.length > 0) {
                for (const item of pedido.pedido_ingrediente) {
                    // Ver cuánto dicen que ha llegado ahora (si no mandan nada, asume que llega lo que faltaba)
                    let cantidadQueLlegaAhora = 0;

                    if (lineasRecibidas) {
                        const linea = lineasRecibidas.find((l: any) => Number(l.productoId) === item.id_ingrediente);
                        cantidadQueLlegaAhora = linea ? Number(linea.cantidad) : 0;
                    } else {
                        // Comportamiento clásico: Confirma todo lo que queda pendiente
                        cantidadQueLlegaAhora = Number(item.cantidad_solicitada) - Number(item.cantidad_recibida);
                    }

                    if (cantidadQueLlegaAhora > 0) {
                        // Sumar al stock real del economato
                        await tx.ingrediente.update({
                            where: { id_ingrediente: item.id_ingrediente },
                            data: { stock: { increment: cantidadQueLlegaAhora } }
                        });

                        // Registrar en la línea del pedido lo que acaba de entrar
                        await tx.pedido_ingrediente.update({
                            where: {
                                id_pedido_id_ingrediente: { id_pedido: pedido.id_pedido, id_ingrediente: item.id_ingrediente }
                            },
                            data: { cantidad_recibida: { increment: cantidadQueLlegaAhora } }
                        });
                    }

                    // Comprobar si ya se recibió todo lo que se pidió
                    const totalRecibido = Number(item.cantidad_recibida) + cantidadQueLlegaAhora;
                    if (totalRecibido < Number(item.cantidad_solicitada)) {
                        pedidoCompletado = false; // Falta mercancía por llegar
                    }
                }
            }

            // 2B. Procesar Materiales
            if (pedido.pedido_material.length > 0) {
                for (const item of pedido.pedido_material) {
                    let cantidadQueLlegaAhora = 0;

                    if (lineasRecibidas) {
                        const linea = lineasRecibidas.find((l: any) => Number(l.productoId) === item.id_material);
                        cantidadQueLlegaAhora = linea ? Number(linea.cantidad) : 0;
                    } else {
                        cantidadQueLlegaAhora = Number(item.cantidad_solicitada) - Number(item.cantidad_recibida);
                    }

                    if (cantidadQueLlegaAhora > 0) {
                        await tx.material.update({
                            where: { id_material: item.id_material },
                            data: { stock: { increment: cantidadQueLlegaAhora } }
                        });

                        await tx.pedido_material.update({
                            where: {
                                id_pedido_id_material: { id_pedido: pedido.id_pedido, id_material: item.id_material }
                            },
                            data: { cantidad_recibida: { increment: cantidadQueLlegaAhora } }
                        });
                    }

                    const totalRecibido = Number(item.cantidad_recibida) + cantidadQueLlegaAhora;
                    if (totalRecibido < Number(item.cantidad_solicitada)) {
                        pedidoCompletado = false;
                    }
                }
            }

            // 3. Cambiar el estado según lo evaluado
            const nuevoEstado = pedidoCompletado ? estado_pedido.CONFIRMADO : estado_pedido.INCOMPLETO;

            return await tx.pedido.update({
                where: { id_pedido: Number(id) },
                data: { estado: nuevoEstado }
            });
        });

        res.json(resultado);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error al confirmar el pedido' });
    }
};