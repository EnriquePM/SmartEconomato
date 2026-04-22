import { useState } from "react";

export const useModalPedidos = (
  pedidoActual: any,
  enviarPedido: () => Promise<void>,
  guardarBorrador: () => Promise<void>,
  tipoPedido: 'productos' | 'materiales'
) => {
  const [terminoBusqueda, setTermoBusqueda] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [procesando, setProcesando] = useState(false);

  // Inicializamos con funciones reales para que TS no se queje
  const [alerta, setAlerta] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    onConfirm: () => {}, 
  });

  const cerrarAlerta = () => setAlerta((prev) => ({ ...prev, isOpen: false }));

  const validarPedido = (): boolean => {
    // 1. Validar Proveedor
    if (!pedidoActual.proveedor || pedidoActual.proveedor === "") {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Proveedor no seleccionado',
        message: 'Debes elegir un proveedor de la lista antes de continuar.',
        onConfirm: cerrarAlerta
      });
      return false;
    }

    // 2. Validar Líneas (Ingredientes/Materiales)
    const lineas = tipoPedido === 'productos' 
      ? pedidoActual.pedido_ingrediente || [] 
      : pedidoActual.pedido_material || [];

    if (lineas.length === 0) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Pedido vacío',
        message: 'No puedes procesar un pedido sin artículos. Añade al menos uno.',
        onConfirm: cerrarAlerta
      });
      return false;
    }

    return true;
  };

  const ejecutarEnvio = async () => {
    cerrarAlerta();
    setProcesando(true);
    try {
      await enviarPedido();
      // No ponemos alerta de éxito aquí porque normalmente el Modal se cierra
    } catch (error: any) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Error al guardar',
        message: 'No se ha podido guardar el pedido. Inténtalo de nuevo.',
        onConfirm: cerrarAlerta
      });
    } finally {
      setProcesando(false);
    }
  };

  const solicitarConfirmacion = () => {
    if (!validarPedido()) return;

    setAlerta({
      isOpen: true,
      type: 'confirm',
      title: '¿Confirmar Envío?',
      message: `Estás a punto de enviar este pedido a ${pedidoActual.proveedor}.`,
      onConfirm: ejecutarEnvio
    });
  };

  const manejarBorrador = async () => {
    // Para el borrador quizás solo validamos el proveedor
    if (!pedidoActual.proveedor) {
        setAlerta({
            isOpen: true,
            type: 'error',
            title: 'Falta Proveedor',
            message: 'Incluso para borradores, necesitamos saber el proveedor.',
            onConfirm: cerrarAlerta
          });
          return;
    }

    setProcesando(true);
    try {
      await guardarBorrador();
      setAlerta({
        isOpen: true,
        type: 'success',
        title: 'Borrador Guardado',
        message: 'El pedido se ha guardado localmente con éxito.',
        onConfirm: cerrarAlerta
      });
    } catch (error) {
      setAlerta({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudo guardar el borrador.',
        onConfirm: cerrarAlerta
      });
    } finally {
      setProcesando(false);
    }
  };

  return {
    terminoBusqueda,
    setTermoBusqueda,
    mostrarResultados,
    setMostrarResultados,
    procesando,
    alerta: {
      ...alerta,
      cerrar: cerrarAlerta,
      solicitar: solicitarConfirmacion,
      guardarBorrador: manejarBorrador
    }
  };
};