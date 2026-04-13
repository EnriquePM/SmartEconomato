import type { Pedido } from "../models/Pedidos";

const API_URL = '/api';

const normalizarPedidoPayload = (pedidoData: Pedido) => ({
  ...pedidoData,
  pedido_ingrediente: (pedidoData.pedido_ingrediente || []).filter(
    (linea) => Number(linea.id_ingrediente) > 0 && Number(linea.cantidad_solicitada) > 0
  ),
  pedido_material: (pedidoData.pedido_material || []).filter(
    (linea) => Number(linea.id_material) > 0 && Number(linea.cantidad_solicitada) > 0
  ),
  total_estimado: pedidoData.total_estimado ?? 0,
  tipo_pedido: pedidoData.tipo_pedido,
  id_usuario: pedidoData.id_usuario || 1
});

// 1. Obtener todos los pedidos (para la lista principal)
export const getPedidosService = async (): Promise<Pedido[]> => {
  const res = await fetch(`${API_URL}/pedidos`);
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return await res.json();
};

// 2. Obtener UN pedido con todo su detalle (productos incluidos)
export const getPedidoByIdService = async (id: number): Promise<Pedido> => {
  const res = await fetch(`${API_URL}/pedidos/${id}`);
  if (!res.ok) throw new Error("Error al obtener el detalle del pedido");
  return await res.json();
};

export const guardarPedidoService = async (pedidoData: Pedido) => {
  let url = `${API_URL}/pedidos`;
  let metodo: 'POST' | 'PUT' = 'POST';

  if (pedidoData.id_pedido) {
    if (pedidoData.estado === 'CONFIRMADO') {
      url = `${API_URL}/pedidos/${pedidoData.id_pedido}/confirmar`;
      metodo = 'PUT';
    } else {
      url = `${API_URL}/pedidos/${pedidoData.id_pedido}`;
      metodo = 'PUT';
    }
  }

  const payload = normalizarPedidoPayload(pedidoData);

  const res = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return await res.json();
};



// 4. Eliminar Pedido 
export const eliminarPedidoService = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/pedidos/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("No se pudo eliminar el pedido");
};
