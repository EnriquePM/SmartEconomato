import { useState, useEffect } from 'react';
import type { Pedido, EstadoPedido, PedidoIngrediente, PedidoMaterial } from '../models/Pedidos';
import type { ItemInventario } from '../models/ItemInventario';

import { getPedidosService, guardarPedidoService, eliminarPedidoService } from '../services/pedidoService';
import { getIngredientes } from '../services/inventarioService';
import { getMateriales } from '../services/materialesService';
import { getProveedores } from '../services/proveedorService';

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
    //esto lo tengo que pasar a mapper??
    const normalizados: Pedido[] = data.map(p => ({
      ...p,
      tipo_pedido: p.tipo_pedido || 'productos', 
      total_estimado: p.total_estimado ?? 0,    
      proveedor: p.proveedor || '',              
      observaciones: p.observaciones || '',     
      pedido_ingrediente: p.pedido_ingrediente || [],
      pedido_material: p.pedido_material || []
    }));
    setPedidos(normalizados);
  })
  .catch(console.error);

  getProveedores()
    .then(data => { console.log("Proveedores:", data); setCatalogoProveedores(data || []); })
    .catch(console.error);
}, []);


  // Cargar inventario según tipoPedido
  useEffect(() => {
    const cargarInventario = async () => {
      try {
        const data = tipoPedido === 'productos' ? await getIngredientes() : await getMateriales();
        setCatalogoProductos(data);
        console.log("Inventario cargado:", data);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      }
    };
    cargarInventario();
  }, [tipoPedido]);

  // Agregar línea
  const agregarLinea = () => {
    if (tipoPedido === 'productos') {
      setPedidoActual(prev => ({
        ...prev,
        pedido_ingrediente: [
          ...(prev.pedido_ingrediente || []),
          { id_ingrediente: 0, cantidad_solicitada: 1 }
        ]
      }));
    } else {
      setPedidoActual(prev => ({
        ...prev,
        pedido_material: [
          ...(prev.pedido_material || []),
          { id_material: 0, cantidad_solicitada: 1 }
        ]
      }));
    }
  };

  // Seleccionar producto/material
  const seleccionarProducto = (index: number, idStr: number) => {
    const id = Number(idStr);
    const item = catalogoProductos.find(p => p.id === id);
    if (!item) return;

    if (tipoPedido === 'productos') {
      const nuevas = [...(pedidoActual.pedido_ingrediente || [])];
      nuevas[index] = { id_ingrediente: item.id, cantidad_solicitada: 1 };
      setPedidoActual(prev => ({ ...prev, pedido_ingrediente: nuevas }));
    } else {
      const nuevas = [...(pedidoActual.pedido_material || [])];
      nuevas[index] = { id_material: item.id, cantidad_solicitada: 1 };
      setPedidoActual(prev => ({ ...prev, pedido_material: nuevas }));
    }
    recalcularTotal();
  };

  // Actualizar cantidad
  const actualizarLinea = (index: number, cantidad: number) => {
    if (tipoPedido === 'productos') {
      const nuevas = [...(pedidoActual.pedido_ingrediente || [])];
      nuevas[index] = { ...nuevas[index], cantidad_solicitada: cantidad };
      setPedidoActual(prev => ({ ...prev, pedido_ingrediente: nuevas }));
    } else {
      const nuevas = [...(pedidoActual.pedido_material || [])];
      nuevas[index] = { ...nuevas[index], cantidad_solicitada: cantidad };
      setPedidoActual(prev => ({ ...prev, pedido_material: nuevas }));
    }
    recalcularTotal();
  };

  // Borrar línea
  const borrarLinea = (index: number) => {
    if (tipoPedido === 'productos') {
      const nuevas = [...(pedidoActual.pedido_ingrediente || [])];
      nuevas.splice(index, 1);
      setPedidoActual(prev => ({ ...prev, pedido_ingrediente: nuevas }));
    } else {
      const nuevas = [...(pedidoActual.pedido_material || [])];
      nuevas.splice(index, 1);
      setPedidoActual(prev => ({ ...prev, pedido_material: nuevas }));
    }
    recalcularTotal();
  };

  // Calcular total estimado (basado en precio si lo tenemos)
  const recalcularTotal = () => {
    let total = 0;
    if (tipoPedido === 'productos') {
      total = (pedidoActual.pedido_ingrediente || []).reduce((acc, l) => {
        const prod = catalogoProductos.find(p => p.id === l.id_ingrediente);
        return acc + (prod?.precio || 0) * l.cantidad_solicitada;
      }, 0);
    } else {
      total = (pedidoActual.pedido_material || []).reduce((acc, l) => {
        const prod = catalogoProductos.find(p => p.id === l.id_material);
        return acc + (prod?.precio || 0) * l.cantidad_solicitada;
      }, 0);
    }
    setPedidoActual(prev => ({ ...prev, total_estimado: total }));
  };

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
    alert("Pedido guardado con éxito");
    setVista('lista');

    const pedidosActualizados = await getPedidosService();

    setPedidos(pedidosActualizados);
  } catch (e: any) {
    alert("Error al guardar: " + e.message);
  }
};



  // Eliminar pedido
  const eliminarPedido = async (id: number) => {
    if (!confirm("¿Eliminar este pedido?")) return;
    try {
      await eliminarPedidoService(id);
      setPedidos(prev => prev.filter(p => p.id_pedido !== id));
    } catch (e) {
      alert("Error al eliminar");
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
