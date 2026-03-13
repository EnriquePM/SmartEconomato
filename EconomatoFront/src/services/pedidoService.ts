import type { Pedido } from "../models/Pedidos";

const API_URL = 'http://localhost:3000/api'; 

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

  const payload = {
    ...pedidoData,
    pedido_ingrediente: pedidoData.pedido_ingrediente || [],
    pedido_material: pedidoData.pedido_material || [],
    id_usuario: 1
  };

  console.log("El array de ingredientes que se va a enviar al backend:", payload);

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