import { useState, useEffect } from 'react';
import type { Pedido, EstadoPedido } from '../models/Pedidos';
import type { ItemInventario } from '../models/ItemInventario';

import { getPedidosService, guardarPedidoService, eliminarPedidoService } from '../services/pedidoService';
import { getIngredientes } from '../services/inventarioService';
import { getMateriales } from '../services/materialesService';
import { getProveedores } from '../services/proveedorService';

const normalizarPedido = (p: Pedido): Pedido => ({
  ...p,
  tipo_pedido: p.tipo_pedido || 'productos',
  total_estimado: Number(p.total_estimado ?? 0),
  proveedor: p.proveedor || '',
  observaciones: p.observaciones || '',
  pedido_ingrediente: p.pedido_ingrediente?.map(pi => ({
    ...pi,
    cantidad_solicitada: Number(pi.cantidad_solicitada ?? 0),
    cantidad_recibida: Number(pi.cantidad_recibida ?? 0)
  })) || [],
  pedido_material: p.pedido_material?.map(pm => ({
    ...pm,
    cantidad_solicitada: Number(pm.cantidad_solicitada ?? 0),
    cantidad_recibida: Number(pm.cantidad_recibida ?? 0)
  })) || []
});

const calcularTotalEstimado = (
  pedido: Pedido,
  tipoPedido: 'productos' | 'utensilios',
  catalogoProductos: ItemInventario[]
): number => {
  if (tipoPedido === 'productos') {
    return (pedido.pedido_ingrediente || []).reduce((acc, linea) => {
      const producto = catalogoProductos.find((p) => p.id === linea.id_ingrediente);
      return acc + (producto?.precio || 0) * Number(linea.cantidad_solicitada || 0);
    }, 0);
  }

  return (pedido.pedido_material || []).reduce((acc, linea) => {
    const producto = catalogoProductos.find((p) => p.id === linea.id_material);
    return acc + (producto?.precio || 0) * Number(linea.cantidad_solicitada || 0);
  }, 0);
};

export const usePedidos = () => {
  const [vista, setVista] = useState<'lista' | 'formulario'>('lista');
  const [tipoPedido, setTipoPedido] = useState<'productos' | 'utensilios'>('productos');
  const [busqueda, setBusqueda] = useState('');

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [catalogoProductos, setCatalogoProductos] = useState<ItemInventario[]>([]);
  const [catalogoProveedores, setCatalogoProveedores] = useState<any[]>([]);

  const [pedidoActual, setPedidoActual] = useState<Pedido>({
    id_usuario: 1,
    proveedor: '',
    fecha_pedido: new Date().toISOString().split('T')[0],
    estado: 'BORRADOR',
    observaciones: '',
    total_estimado: 0,
    tipo_pedido: 'productos',
    pedido_ingrediente: [],
    pedido_material: []
  });

  // Cargar pedidos y proveedores
  useEffect(() => {
    getPedidosService()
      .then(data => {
        const normalizados: Pedido[] = data.map(normalizarPedido);
        setPedidos(normalizados);
      })
      .catch(console.error);

    getProveedores()
      .then(data => setCatalogoProveedores(data || []))
      .catch(console.error);
  }, []);

  // Cargar inventario según tipoPedido
  useEffect(() => {
    const cargarInventario = async () => {
      try {
        const data = tipoPedido === 'productos' ? await getIngredientes() : await getMateriales();
        setCatalogoProductos(data);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      }
    };
    cargarInventario();
  }, [tipoPedido]);

  // Agregar línea
  const agregarLinea = () => {
    if (tipoPedido === 'productos') {
      setPedidoActual((prev) => {
        const siguiente: Pedido = {
          ...prev,
          pedido_ingrediente: [
            ...(prev.pedido_ingrediente || []),
            { id_ingrediente: 0, cantidad_solicitada: 1, cantidad_recibida: 0 }
          ]
        };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    } else {
      setPedidoActual((prev) => {
        const siguiente: Pedido = {
          ...prev,
          pedido_material: [
            ...(prev.pedido_material || []),
            { id_material: 0, cantidad_solicitada: 1, cantidad_recibida: 0 }
          ]
        };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    }
  };

  // Seleccionar producto/material
  const seleccionarProducto = (index: number, idStr: number) => {
    const id = Number(idStr);
    const item = catalogoProductos.find(p => p.id === id);
    if (!item) return;

    if (tipoPedido === 'productos') {
      setPedidoActual((prev) => {
        const nuevas = [...(prev.pedido_ingrediente || [])];
        nuevas[index] = { id_ingrediente: item.id, cantidad_solicitada: 1, cantidad_recibida: 0 };
        const siguiente: Pedido = { ...prev, pedido_ingrediente: nuevas };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    } else {
      setPedidoActual((prev) => {
        const nuevas = [...(prev.pedido_material || [])];
        nuevas[index] = { id_material: item.id, cantidad_solicitada: 1, cantidad_recibida: 0 };
        const siguiente: Pedido = { ...prev, pedido_material: nuevas };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    }
  };

  // Actualizar cantidad
  const actualizarLinea = (index: number, cantidad: number) => {
    const cantidadSegura = Math.max(0, Number.isFinite(cantidad) ? cantidad : 0);

    if (tipoPedido === 'productos') {
      setPedidoActual((prev) => {
        const nuevas = [...(prev.pedido_ingrediente || [])];
        nuevas[index] = { ...nuevas[index], cantidad_solicitada: cantidadSegura };
        const siguiente: Pedido = { ...prev, pedido_ingrediente: nuevas };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    } else {
      setPedidoActual((prev) => {
        const nuevas = [...(prev.pedido_material || [])];
        nuevas[index] = { ...nuevas[index], cantidad_solicitada: cantidadSegura };
        const siguiente: Pedido = { ...prev, pedido_material: nuevas };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    }
  };

  // Borrar línea
  const borrarLinea = (index: number) => {
    if (tipoPedido === 'productos') {
      setPedidoActual((prev) => {
        const nuevas = [...(prev.pedido_ingrediente || [])];
        nuevas.splice(index, 1);
        const siguiente: Pedido = { ...prev, pedido_ingrediente: nuevas };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    } else {
      setPedidoActual((prev) => {
        const nuevas = [...(prev.pedido_material || [])];
        nuevas.splice(index, 1);
        const siguiente: Pedido = { ...prev, pedido_material: nuevas };

        return {
          ...siguiente,
          total_estimado: calcularTotalEstimado(siguiente, tipoPedido, catalogoProductos)
        };
      });
    }
  };

  // Guardar pedido (Sin alertas nativas)
  const guardarPedido = async (nuevoEstado: EstadoPedido) => {
    try {
      const payload: Pedido = {
        ...pedidoActual,
        pedido_ingrediente: pedidoActual.pedido_ingrediente || [],
        pedido_material: pedidoActual.pedido_material || [],
        tipo_pedido: tipoPedido,
        id_usuario: pedidoActual.id_usuario,
        estado: nuevoEstado
      };

      await guardarPedidoService(payload);
      
      // Ya no mostramos alert aquí. Se encarga el componente visual.
      setVista('lista');

      const pedidosActualizados = await getPedidosService();
      setPedidos(pedidosActualizados.map(normalizarPedido));
    } catch (e: any) {
      console.error("Error al guardar:", e);
      throw new Error(e.message || "Error al guardar el pedido"); // Lanzamos el error para que la UI lo atrape si quiere
    }
  };

  // Eliminar pedido (Sin confirm nativo ni alerts)
  const eliminarPedido = async (id: number) => {
    // El confirm nativo se ha eliminado. Se asume que la UI ya pidió confirmación antes de llamar a esta función.
    try {
      await eliminarPedidoService(id);
      setPedidos(prev => prev.filter(p => p.id_pedido !== id));
    } catch (e: any) {
      console.error("Error al eliminar:", e);
      throw new Error("No se pudo eliminar el pedido."); // Lanzamos el error para la UI
    }
  };

  return {
    vista, setVista,
    tipoPedido, setTipoPedido,
    busqueda, setBusqueda,
    pedidos, catalogoProductos, catalogoProveedores,
    pedidoActual, setPedidoActual,
    agregarLinea, seleccionarProducto, actualizarLinea, borrarLinea,
    guardarPedido, eliminarPedido
  };
};