// src/hooks/usePedidos.ts

import { useState, useEffect } from 'react';
// "import type" para los modelos
import type { Pedido, LineaPedido, ItemCatalogo } from '../models/Pedidos';
import {
    getPedidosService,
    getCatalogoService,
    getProveedoresService,
    guardarPedidoService,
    eliminarPedidoService
} from '../services/pedidoService';

export const usePedidos = () => {
    const [vista, setVista] = useState<'lista' | 'formulario'>('lista');
    const [tipoPedido, setTipoPedido] = useState<'productos' | 'utensilios'>('productos');
    const [busqueda, setBusqueda] = useState('');

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [catalogoProductos, setCatalogoProductos] = useState<ItemCatalogo[]>([]);
    const [catalogoProveedores, setCatalogoProveedores] = useState<any[]>([]);

    const [pedidoActual, setPedidoActual] = useState<Pedido>({
        id: '', tipo: 'productos', proveedor: '', fecha: new Date().toISOString().split('T')[0],
        estado: 'BORRADOR', total: 0, observaciones: '', lineas: []
    });

    useEffect(() => {
        getPedidosService().then(setPedidos).catch(console.error);
    }, []);

    useEffect(() => {
        getCatalogoService(tipoPedido).then(setCatalogoProductos).catch(console.error);
        getProveedoresService().then(setCatalogoProveedores).catch(console.error);
    }, [tipoPedido]);

    const agregarLinea = () => {
        const nueva: LineaPedido = { id: Date.now(), productoId: 0, nombre: '', categoria: '', unidad: '', cantidad: 1, precio: 0, subtotal: 0 };
        setPedidoActual(prev => ({ ...prev, lineas: [...prev.lineas, nueva] }));
    };

    const recalcularTotal = (lineas: LineaPedido[]) => {
        const total = lineas.reduce((acc, curr) => acc + curr.subtotal, 0);
        setPedidoActual(prev => ({ ...prev, lineas, total }));
    };

    const seleccionarProducto = (lineaId: number, prodIdStr: string) => {
        const prodId = Number(prodIdStr);
        const prod = catalogoProductos.find(p => p.id === prodId);
        if (!prod) return;
        const nuevasLineas = pedidoActual.lineas.map(l => l.id === lineaId ? {
            ...l, productoId: prod.id, nombre: prod.nombre, categoria: prod.categoria,
            unidad: prod.unidad, precio: prod.precioUltimo, subtotal: l.cantidad * prod.precioUltimo
        } : l);
        recalcularTotal(nuevasLineas);
    };

    const actualizarLinea = (lineaId: number, campo: 'cantidad' | 'precio', val: string) => {
        const num = parseFloat(val) || 0;
        const nuevasLineas = pedidoActual.lineas.map(l => {
            if (l.id !== lineaId) return l;
            const updated = { ...l, [campo]: num };
            updated.subtotal = updated.cantidad * updated.precio;
            return updated;
        });
        recalcularTotal(nuevasLineas);
    };

    const borrarLinea = (id: number) => {
        recalcularTotal(pedidoActual.lineas.filter(l => l.id !== id));
    };

    const guardarPedido = async (estado: 'BORRADOR' | 'PENDIENTE') => {
        if (!pedidoActual.proveedor) return alert("Selecciona proveedor");

        const payload = {
            tipoPedido: tipoPedido,
            proveedor: pedidoActual.proveedor,
            total: Number(pedidoActual.total),
            observaciones: pedidoActual.observaciones,
            estado: estado,

            lineas: pedidoActual.lineas.map(l => ({
                productoId: Number(l.productoId),
                cantidad: Number(l.cantidad)
            }))
        };

        try {
            console.log("📦 Payload enviado al backend:", payload);
            await guardarPedidoService(payload);

            alert("¡Pedido guardado correctamente! 🎉");
            window.location.reload();
        } catch (e: any) {
            console.error(e);
            alert("Error al guardar: " + (e.message || "Desconocido"));
        }
    };

    const eliminarPedido = async (id: string | number) => {
        if (!confirm("¿Eliminar?")) return;
        try {
            await eliminarPedidoService(id);
            setPedidos(prev => prev.filter(p => p.id !== id));
        } catch (e) { alert("Error al eliminar"); }
    };

    return {
        vista, setVista, tipoPedido, setTipoPedido, busqueda, setBusqueda,
        pedidos, catalogoProductos, catalogoProveedores, pedidoActual, setPedidoActual,
        agregarLinea, seleccionarProducto, actualizarLinea, borrarLinea, guardarPedido, eliminarPedido
    };
};