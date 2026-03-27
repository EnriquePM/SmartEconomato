import { useState } from "react";
import type { Pedido } from "../models/Pedidos";

export const useRecepcionModal = (pedido: Pedido) => {
  const [lineas, setLineas] = useState(() => {
    const esProductos = pedido.tipo_pedido === 'productos';
    const origen = esProductos ? (pedido.pedido_ingrediente || []) : (pedido.pedido_material || []);
    
    return origen.map((l: any) => ({
      id_referencia: esProductos ? l.id_ingrediente : l.id_material,
      nombre: l.ingrediente?.nombre || l.material?.nombre || "Producto",
      unidad_medida: l.ingrediente?.unidad_medida || l.material?.unidad_medida || "uds",
      cantidadSolicitada: Number(l.cantidad_solicitada || 0),
      cantidadRecibida: Number(l.cantidad_recibida || l.cantidad_solicitada || 0),
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

  const actualizarValor = (idRef: number, campo: string, valor: any) => {
    const valorFinal = campo === 'cantidadRecibida' ? (valor === "" ? 0 : Number(valor)) : valor;
    setLineas(prev => prev.map(l => l.id_referencia === idRef ? { ...l, [campo]: valorFinal } : l));
    if (lineaEnFoco?.id_referencia === idRef) {
      setLineaEnFoco((prev: any) => ({ ...prev, [campo]: valorFinal }));
    }
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
    limpiarFoco
  };
};