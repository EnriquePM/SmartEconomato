import type { LineaPedidoDTO, LineaUI } from "../models/Recepcion";

const API_URL = '/api';

const extraerMensajeError = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json();
    if (typeof data?.error === 'string') {
      return data.error;
    }
    if (typeof data?.message === 'string') {
      return data.message;
    }
  }

  const errorText = await response.text();
  return errorText || 'Error al confirmar el pedido';
};

export const confirmarPedidoService = async (idPedido: number, lineas: LineaUI[]) => {
  const payload: LineaPedidoDTO = {
    lineasRecibidas: lineas
      .filter((linea) => Number.isFinite(Number(linea.cantidadRecibida)) && Number(linea.cantidadRecibida) > 0)
      .map(linea => ({
        productoId: Number(linea.productoId),
        cantidad: Number(linea.cantidadRecibida)
      }))
  };

  const response = await fetch(`${API_URL}/pedidos/${idPedido}/confirmar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await extraerMensajeError(response));
  }

  return response.json();
};



