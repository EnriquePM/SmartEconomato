import type { LineaPedidoDTO, LineaUI } from "../models/Recepcion";

export const confirmarPedidoService = async (idPedido: number, lineas: LineaUI[]) => {
  // Transformamos los datos al formato que el back exige
  const payload: LineaPedidoDTO = {
    lineasRecibidas: lineas.map(linea => ({
      productoId: linea.productoId,
      cantidad: linea.cantidadRecibida
    }))
  };

  const response = await fetch(`/api/pedidos/${idPedido}/confirmar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Error al confirmar el pedido');
  return response.json();
};


