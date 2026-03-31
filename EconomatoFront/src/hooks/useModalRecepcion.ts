import { useState } from "react";
import type { Pedido } from "../models/Pedidos";
import { guardarPedidoService } from "../services/pedidoService";

export const useRecepcionModal = (pedido: Pedido, /*onRefresh: () => void,*/ onSaveLocal: (p: any) => void) => {
  const [lineas, setLineas] = useState(() => {
    const esProductos = pedido.tipo_pedido === 'productos';
    const origen = esProductos ? (pedido.pedido_ingrediente || []) : (pedido.pedido_material || []);
    
    return origen.map((l: any) => ({
      id_referencia: esProductos ? l.id_ingrediente : l.id_material,
      nombre: l.ingrediente?.nombre || l.material?.nombre || "Producto",
      unidad_medida: l.ingrediente?.unidad_medida || l.material?.unidad_medida || "uds",
      cantidad_solicitada: Number(l.cantidad_solicitada || 0),
      cantidad_recibida: Number(l.cantidad_recibida ||  0),
      fechaCaducidad: "",
      observaciones: ""
    }));
  });

  const [busqueda, setBusqueda] = useState("");
  const [lineaEnFoco, setLineaEnFoco] = useState<any | null>(null);

  const lineasFiltradas = lineas.filter(l => 
    l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.id_referencia.toString().includes(busqueda)
  );

  const manejarBusqueda = (texto: string) => {
    setBusqueda(texto);
    const exacta = lineas.find(l => l.nombre.toLowerCase() === texto.toLowerCase());
    if (exacta) setLineaEnFoco(exacta);
  };

  const seleccionarLinea = (linea: any) => {
  if (Number(linea.cantidad_recibida) === 0) {
    const lineaConSugerencia = {
      ...linea,
      cantidad_recibida: linea.cantidad_solicitada 
    };
    setLineaEnFoco(lineaConSugerencia);
  } else {
    setLineaEnFoco(linea);
  }
};

  const actualizarValor = (idRef: number, campo: string, valor: any) => {
    const valorFinal = campo === 'cantidad_recibida' ? (valor === "" ? 0 : Number(valor)) : valor;
    setLineas(prev => prev.map(l => l.id_referencia === idRef ? { ...l, [campo]: valorFinal } : l));
    if (lineaEnFoco?.id_referencia === idRef) {
      setLineaEnFoco((prev: any) => ({ ...prev, [campo]: valorFinal }));
    }
  };

  /*
  const enviarDatos = async () => {
    console.log("Botón pulsado, iniciando envío...");
    const esProd = pedido.tipo_pedido === 'productos';
    
    const pedidoUpdate: Pedido = {
      ...pedido,
      estado: 'CONFIRMADO', 
      pedido_ingrediente: esProd ? lineas.map(l => ({
        id_pedido: pedido.id_pedido,
        id_ingrediente: l.id_referencia,
        cantidad_solicitada: l.cantidadSolicitada,
        cantidad_recibida: l.cantidadRecibida,
      })) : [],
      pedido_material: !esProd ? lineas.map(l => ({
        id_pedido: pedido.id_pedido,
        id_material: l.id_referencia,
        cantidad_solicitada: l.cantidadSolicitada,
        cantidad_recibida: l.cantidadRecibida,
      })) : []
    };

    await guardarPedidoService(pedidoUpdate);
    onRefresh();
    onSaveLocal(pedidoUpdate);
    limpiarFoco();
   
  };

*/

const enviarDatos = async () => {
    console.log("🚀 Botón 'Guardar y continuar' pulsado (Hardcodeado)");
  
    setLineas(prev => prev.map(l => 
      l.id_referencia === lineaEnFoco.id_referencia ? lineaEnFoco : l
    ));

    const esProd = pedido.tipo_pedido === 'productos';
    const pedidoUpdate = {
      ...pedido,
      pedido_ingrediente: esProd ? lineas.map(l => {
          if(l.id_referencia === lineaEnFoco.id_referencia) return lineaEnFoco;
          return l;
      }) : [],
    };

  onSaveLocal(pedidoUpdate);
  limpiarFoco();
    
    // Limpiamos el buscador para seguir con otro
    limpiarFoco();
  };

  const finalizarRecepcion = () => {
    console.log("🏁 Finalizando recepción total...");
    // Aquí podrías cerrar el modal si quisieras
  };

  const limpiarFoco = () => {
    setLineaEnFoco(null);
    setBusqueda("");
  };

  return { 
    lineasOriginales: lineas, 
    lineasMostradas: lineasFiltradas, 
    lineaEnFoco, 
    setLineaEnFoco, 
    busqueda, 
    manejarBusqueda, 
    actualizarValor,
    limpiarFoco,
    enviarDatos,
    seleccionarLinea,
    finalizarRecepcion
  };
};