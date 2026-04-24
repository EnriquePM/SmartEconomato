import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { estado_pedido } from '@prisma/client';
import { logActividad } from '../services/actividadLog.service';

const pedidoInclude = {
    usuario: {
        select: { nombre: true, apellido1: true, email: true }
    },
    pedido_ingrediente: {
        include: { ingrediente: true }
    },
    pedido_material: {
        include: { material: true }
    }
};

const parseEstadoPedido = (estado: unknown): estado_pedido => {
    switch (estado) {
        case 'BORRADOR':
            return estado_pedido.BORRADOR;
        case 'VALIDADO':
            return estado_pedido.VALIDADO;
        case 'INCOMPLETO':
            return estado_pedido.INCOMPLETO;
        case 'CONFIRMADO':
            return estado_pedido.CONFIRMADO;
        case 'RECHAZADO':
            return estado_pedido.RECHAZADO;
        case 'PENDIENTE':
        default:
            return estado_pedido.PENDIENTE;
    }
};

const mapIngredienteLineas = (lineas: any[] = []) => {
    return lineas
        .map((linea) => ({
            id_ingrediente: Number(linea.id_ingrediente ?? linea.productoId ?? linea.id_producto),
            cantidad_solicitada: Number(linea.cantidad_solicitada ?? linea.cantidad ?? 0)
        }))
        .filter((linea) => linea.id_ingrediente > 0 && linea.cantidad_solicitada > 0);
};

const mapMaterialLineas = (lineas: any[] = []) => {
    return lineas
        .map((linea) => ({
            id_material: Number(linea.id_material ?? linea.productoId ?? linea.id_producto),
            cantidad_solicitada: Number(linea.cantidad_solicitada ?? linea.cantidad ?? 0)
        }))
        .filter((linea) => linea.id_material > 0 && linea.cantidad_solicitada > 0);
};

const normalizePedidoPayload = (body: any) => {
    const tipoPedido = body.tipo_pedido ?? body.tipoPedido ?? 'productos';
    const pedidoIngredientes = Array.isArray(body.pedido_ingrediente) ? mapIngredienteLineas(body.pedido_ingrediente) : [];
    const pedidoMateriales = Array.isArray(body.pedido_material) ? mapMaterialLineas(body.pedido_material) : [];

    if (pedidoIngredientes.length > 0 || pedidoMateriales.length > 0) {
        return {
            proveedor: body.proveedor ?? null,
            observaciones: body.observaciones ?? null,
            fecha_pedido: body.fecha_pedido ? new Date(body.fecha_pedido) : new Date(),
            total_estimado: body.total_estimado ?? body.total ?? 0,
            tipo_pedido: tipoPedido,
            estado: parseEstadoPedido(body.estado),
            pedido_ingrediente: pedidoIngredientes,
            pedido_material: pedidoMateriales
        };
    }

    const lineas = Array.isArray(body.lineas) ? body.lineas : [];

    return {
        proveedor: body.proveedor ?? null,
        observaciones: body.observaciones ?? null,
        fecha_pedido: body.fecha_pedido ? new Date(body.fecha_pedido) : new Date(),
        total_estimado: body.total_estimado ?? body.total ?? 0,
        tipo_pedido: tipoPedido,
        estado: parseEstadoPedido(body.estado),
        pedido_ingrediente: tipoPedido === 'productos' ? mapIngredienteLineas(lineas) : [],
        pedido_material: tipoPedido === 'utensilios' ? mapMaterialLineas(lineas) : []
    };
};

const buildPedidoData = (payload: ReturnType<typeof normalizePedidoPayload>, id_usuario: number) => {
    const dataPedido: any = {
        id_usuario,
        fecha_pedido: payload.fecha_pedido,
        estado: payload.estado,
        proveedor: payload.proveedor,
        observaciones: payload.observaciones,
        total_estimado: payload.total_estimado,
        tipo_pedido: payload.tipo_pedido
    };

    if (payload.pedido_ingrediente.length > 0) {
        dataPedido.pedido_ingrediente = {
            create: payload.pedido_ingrediente
        };
    }

    if (payload.pedido_material.length > 0) {
        dataPedido.pedido_material = {
            create: payload.pedido_material
        };
    }

    return dataPedido;
};

// 1. CREAR O ACTUALIZAR PEDIDO (Soporta Ingredientes y Materiales)
export const createPedido = async (req: any, res: Response) => {
    // Verificamos el usuario
    const id_usuario = req.user ? req.user.id_usuario : 1;

    try {
        const payload = normalizePedidoPayload(req.body);
        const dataPedido = buildPedidoData(payload, id_usuario);

        const nuevoPedido = await prisma.pedido.create({
            data: dataPedido,
            include: pedidoInclude
        });

        void logActividad(
            id_usuario,
            'Creó un pedido',
            'pedido',
            nuevoPedido.id_pedido,
            `Pedido #${nuevoPedido.id_pedido} — ${payload.tipo_pedido}`,
            '/pedidos'
        );

        res.json(nuevoPedido);

    } catch (error) {
        // Esto nos dirá exactamente por qué falla la BD
        res.status(500).json({ error: 'Error al guardar el pedido', detalle: error });
    }
};

export const updatePedido = async (req: any, res: Response) => {
    const { id } = req.params;
    const idPedido = Number(id);

    if (Number.isNaN(idPedido)) {
        return res.status(400).json({ error: 'ID de pedido no valido' });
    }

    const id_usuario = req.user ? req.user.id_usuario : 1;

    try {
        const pedidoExistente = await prisma.pedido.findUnique({
            where: { id_pedido: idPedido }
        });

        if (!pedidoExistente) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (pedidoExistente.estado === estado_pedido.CONFIRMADO) {
            return res.status(400).json({ error: 'No se puede editar un pedido confirmado' });
        }

        const payload = normalizePedidoPayload(req.body);

        const pedidoActualizado = await prisma.pedido.update({
            where: { id_pedido: idPedido },
            data: {
                ...buildPedidoData(payload, id_usuario),
                pedido_ingrediente: {
                    deleteMany: {},
                    ...(payload.pedido_ingrediente.length > 0 ? { create: payload.pedido_ingrediente } : {})
                },
                pedido_material: {
                    deleteMany: {},
                    ...(payload.pedido_material.length > 0 ? { create: payload.pedido_material } : {})
                }
            },
            include: pedidoInclude
        });

        void logActividad(
            id_usuario,
            'Actualizó un pedido',
            'pedido',
            idPedido,
            `Pedido #${idPedido}`,
            '/pedidos'
        );

        return res.json(pedidoActualizado);
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el pedido', detalle: error });
    }
};

// 2. LISTAR TODOS LOS PEDIDOS (Para la tabla del frontend)
export const getPedidos = async (req: Request, res: Response) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            // Quitamos el 'where: PENDIENTE' para que se vean también los borradores y validados
            include: pedidoInclude,
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

export const getPedidoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const idPedido = Number(id);

    if (Number.isNaN(idPedido)) {
        return res.status(400).json({ error: 'ID de pedido no valido' });
    }

    try {
        const pedido = await prisma.pedido.findUnique({
            where: { id_pedido: idPedido },
            include: pedidoInclude
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.json(pedido);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el detalle del pedido' });
    }
};

// 3. VALIDAR PEDIDO
export const validarPedido = async (req: any, res: Response) => {
    const { id } = req.params;
    const id_usuario = req.user ? req.user.id_usuario : null;

    try {
        const pedidoValidado = await prisma.pedido.update({
            where: { id_pedido: Number(id) },
            data: { estado: estado_pedido.VALIDADO }
        });

        void logActividad(
            id_usuario,
            'Validó un pedido',
            'pedido',
            Number(id),
            `Pedido #${id}`,
            '/pedidos'
        );

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

        const id_usuario = (req as any).user ? (req as any).user.id_usuario : null;
        void logActividad(
            id_usuario,
            'Confirmó recepción de pedido',
            'pedido',
            Number(id),
            `Pedido #${id}`,
            '/recepcion'
        );

        res.json(resultado);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error al confirmar el pedido' });
    }
};