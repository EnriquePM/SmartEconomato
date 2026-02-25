// IMPORTANTE: Subimos 2 niveles para salir de 'mappers' y de 'services'
import type { Pedido, LineaPedido, ItemCatalogo } from "../../models/Pedidos";

export const mapPedidoBackendToFrontend = (p: any): Pedido => {
    let lineasRecuperadas: LineaPedido[] = [];

    if (p.tipo_pedido === 'utensilios' && p.pedido_material) {
        lineasRecuperadas = p.pedido_material.map((pm: any) => ({
            id: Date.now() + Math.random(),
            productoId: pm.id_material,
            nombre: pm.material?.nombre || 'Utensilio desconocido',
            categoria: pm.material?.categoria?.nombre || 'General',
            unidad: pm.material?.unidad_medida || 'u.',
            cantidad: Number(pm.cantidad_solicitada),
            precio: Number(pm.material?.precio_unidad || 0),
            subtotal: Number(pm.cantidad_solicitada) * Number(pm.material?.precio_unidad || 0)
        }));
    } else if (p.pedido_ingrediente) {
        lineasRecuperadas = p.pedido_ingrediente.map((pi: any) => ({
            id: Date.now() + Math.random(),
            productoId: pi.id_ingrediente,
            nombre: pi.ingrediente?.nombre || 'Ingrediente desconocido',
            categoria: pi.ingrediente?.categoria?.nombre || 'General',
            unidad: pi.ingrediente?.unidad_medida || 'u.',
            cantidad: Number(pi.cantidad_solicitada),
            precio: Number(pi.ingrediente?.precio_actual || 0),
            subtotal: Number(pi.cantidad_solicitada) * Number(pi.ingrediente?.precio_actual || 0)
        }));
    }

    return {
        id: p.id_pedido,
        tipo: p.tipo_pedido || 'productos',
        proveedor: p.proveedor || '',
        fecha: p.fecha_pedido ? p.fecha_pedido.split('T')[0] : '',
        estado: p.estado,
        total: Number(p.total_estimado || 0),
        observaciones: p.observaciones || '',
        lineas: lineasRecuperadas
    };
};

export const mapCatalogoToFrontend = (item: any, tipo: 'productos' | 'utensilios'): ItemCatalogo => ({
    id: tipo === 'productos' ? item.id_ingrediente : item.id_material,
    nombre: item.nombre,
    categoria: item.categoria ? (typeof item.categoria === 'object' ? item.categoria.nombre : item.categoria) : 'General',
    unidad: item.unidad_medida || 'u.',
    precioUltimo: Number(item.precio_actual || item.precio_unidad || 0)
});