import { useState } from "react";
import type { Pedido } from "../models/Pedidos";
import type { LineaUI } from "../models/Recepcion";
import { confirmarPedidoService } from "../services/recepcionService";

type LineaRecepcion = {
  id_referencia: number;
  nombre: string;
  unidad_medida: string;
  cantidad_solicitada: number;
  cantidad_recibida_inicial: number;
  cantidad_recibida: number;
  fechaCaducidad: string;
  observaciones: string;
};

const normalizarNumero = (valor: unknown) => {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : 0;
};

const calcularIncrementoRecibido = (cantidadRecibida: number, cantidadInicial: number) => {
  return Math.max(normalizarNumero(cantidadRecibida) - normalizarNumero(cantidadInicial), 0);
};

export const useRecepcionModal = (
  pedido: Pedido,
  onSaveLocal: (p: Pedido) => void,
  onRefresh: () => Promise<void> | void,
  onClose: () => void
) => {
  const [lineas, setLineas] = useState<LineaRecepcion[]>(() => {
    const esProductos = pedido.tipo_pedido === 'productos';
    const origen = esProductos ? (pedido.pedido_ingrediente || []) : (pedido.pedido_material || []);

    return origen.map((l: any) => ({
      id_referencia: esProductos ? l.id_ingrediente : l.id_material,
      nombre: l.ingrediente?.nombre || l.material?.nombre || "Producto",
      unidad_medida: l.ingrediente?.unidad_medida || l.material?.unidad_medida || "uds",
      cantidad_solicitada: normalizarNumero(l.cantidad_solicitada),
      cantidad_recibida_inicial: normalizarNumero(l.cantidad_recibida),
      cantidad_recibida: normalizarNumero(l.cantidad_recibida),
      fechaCaducidad: l.fechaCaducidad || "",
      observaciones: l.observaciones || ""
    }));
  });

  const [busqueda, setBusqueda] = useState("");
  const [lineaEnFoco, setLineaEnFoco] = useState<LineaRecepcion | null>(null);
  const [guardando, setGuardando] = useState(false);

  const lineasFiltradas = lineas.filter(l =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.id_referencia.toString().includes(busqueda)
  );

  const manejarBusqueda = (texto: string) => {
    setBusqueda(texto);
    const exacta = lineas.find(l => l.nombre.toLowerCase() === texto.toLowerCase());
    if (exacta) setLineaEnFoco(exacta);
  };

  const seleccionarLinea = (linea: LineaRecepcion) => {
    if (pedido.estado === 'CONFIRMADO') {
      return;
    }

    if (normalizarNumero(linea.cantidad_recibida) === 0) {
      setLineaEnFoco({
        ...linea,
        cantidad_recibida: linea.cantidad_solicitada
      });
      return;
    }

    setLineaEnFoco(linea);
  };

  const actualizarValor = (idRef: number, campo: string, valor: any) => {
    const valorFinal = campo === 'cantidad_recibida' ? normalizarNumero(valor) : valor;
    setLineas(prev => prev.map(l => l.id_referencia === idRef ? { ...l, [campo]: valorFinal } : l));
    if (lineaEnFoco?.id_referencia === idRef) {
      setLineaEnFoco(prev => (prev ? { ...prev, [campo]: valorFinal } : prev));
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

  const construirPedidoActualizado = (lineasActualizadas: LineaRecepcion[]): Pedido => {
    const esProductos = pedido.tipo_pedido === 'productos';
    const lineasPorId = new Map(lineasActualizadas.map((linea) => [linea.id_referencia, linea]));

    return {
      ...pedido,
      pedido_ingrediente: esProductos
        ? (pedido.pedido_ingrediente || []).map((linea) => {
          const lineaActualizada = lineasPorId.get(linea.id_ingrediente);

          if (!lineaActualizada) {
            return linea;
          }

          return {
            ...linea,
            id_pedido: pedido.id_pedido,
            id_ingrediente: lineaActualizada.id_referencia,
            cantidad_solicitada: lineaActualizada.cantidad_solicitada,
            cantidad_recibida: lineaActualizada.cantidad_recibida
          };
        })
        : pedido.pedido_ingrediente || [],
      pedido_material: !esProductos
        ? (pedido.pedido_material || []).map((linea) => {
          const lineaActualizada = lineasPorId.get(linea.id_material);

          if (!lineaActualizada) {
            return linea;
          }

          return {
            ...linea,
            id_pedido: pedido.id_pedido,
            id_material: lineaActualizada.id_referencia,
            cantidad_solicitada: lineaActualizada.cantidad_solicitada,
            cantidad_recibida: lineaActualizada.cantidad_recibida
          };
        })
        : pedido.pedido_material || []
    };
  };

  const enviarDatos = async () => {
    if (!lineaEnFoco) {
      return;
    }

    const lineasActualizadas = lineas.map((linea) =>
      linea.id_referencia === lineaEnFoco.id_referencia ? lineaEnFoco : linea
    );

    setLineas(lineasActualizadas);
    onSaveLocal(construirPedidoActualizado(lineasActualizadas));
    limpiarFoco();
  };

  const finalizarRecepcion = async () => {
    if (!pedido.id_pedido) {
      alert('El pedido no tiene identificador válido.');
      return;
    }

    try {
      setGuardando(true);

      const lineasParaEnviar: LineaUI[] = lineas
        .map((linea) => {
          const cantidadRecibida = normalizarNumero(linea.cantidad_recibida);
          const faltante = Math.max(linea.cantidad_solicitada - cantidadRecibida, 0);
          const incremento = calcularIncrementoRecibido(cantidadRecibida, linea.cantidad_recibida_inicial);

          return {
            productoId: linea.id_referencia,
            nombre: linea.nombre,
            cantidadFaltante: faltante,
            cantidadRecibida: incremento
          };
        })
        .filter((linea) => linea.cantidadRecibida > 0);

      await confirmarPedidoService(pedido.id_pedido, lineasParaEnviar);
      await onRefresh();
      alert('Recepción guardada correctamente.');
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al finalizar la recepción';
      alert(message);
    } finally {
      setGuardando(false);
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
    limpiarFoco,
    enviarDatos,
    seleccionarLinea,
    finalizarRecepcion,
    guardando
  };
};