import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { estado_pedido } from '@prisma/client';

// 1. CREAR O ACTUALIZAR PEDIDO (Soporta Ingredientes y Materiales)
export const createPedido = async (req: any, res: Response) => {
    console.log("1. --- INICIO CREATE PEDIDO ---");
    console.log("2. Datos recibidos (Body):", req.body);

    // Verificamos el usuario
    const id_usuario = req.user ? req.user.id_usuario : 1;
    console.log("3. ID Usuario asignado:", id_usuario);

    const {
        proveedor, lineas, total, observaciones, tipoPedido, estado
    } = req.body;

    try {
        console.log("4. Intentando crear objeto para Prisma...");

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

        console.log("6. Objeto base preparado:", dataPedido);

        if (lineas && lineas.length > 0) {
            console.log(`7. Procesando ${lineas.length} líneas de tipo: ${tipoPedido}`);
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

        console.log("8. ¡ENVIANDO A PRISMA!");
        const nuevoPedido = await prisma.pedido.create({
            data: dataPedido
        });

        console.log("9. ✅ ¡ÉXITO! Pedido creado con ID:", nuevoPedido.id_pedido);
        res.json(nuevoPedido);

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN PRISMA:", error);
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

// 3. VALIDAR PEDIDO (Cambiar estado a VALIDADO)
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

    try {
        const resultado = await prisma.$transaction(async (tx) => {
            // 1. Obtener el pedido con AMBAS relaciones
            const pedido = await tx.pedido.findUnique({
                where: { id_pedido: Number(id) },
                include: {
                    pedido_ingrediente: true,
                    pedido_material: true
                }
            });

            if (!pedido) throw new Error('Pedido no encontrado');

            if (pedido.estado === estado_pedido.CONFIRMADO) {
                throw new Error('El pedido ya ha sido confirmado anteriormente');
            }

            // 2A. Si es de INGREDIENTES, sumamos stock en tabla ingrediente
            if (pedido.pedido_ingrediente.length > 0) {
                for (const item of pedido.pedido_ingrediente) {
                    // OJO: Asegúrate que tu campo en DB es 'stock_actual' o 'stock'
                    await tx.ingrediente.update({
                        where: { id_ingrediente: item.id_ingrediente },
                        data: {
                            stock: { increment: item.cantidad_solicitada }
                        }
                    });
                }
            }

            // 2B. Si es de MATERIALES, sumamos stock en tabla material
            if (pedido.pedido_material.length > 0) {
                for (const item of pedido.pedido_material) {
                    await tx.material.update({
                        where: { id_material: item.id_material },
                        data: {
                            stock: { increment: item.cantidad_solicitada }
                        }
                    });
                }
            }

            // 3. Cambiar estado a CONFIRMADO
            return await tx.pedido.update({
                where: { id_pedido: Number(id) },
                data: { estado: estado_pedido.CONFIRMADO }
            });
        });

        res.json(resultado);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error al confirmar el pedido' });
    }
};