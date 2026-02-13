// "import type" para los modelos
import type { Pedido, ItemCatalogo } from "../models/Pedidos";
// Import normal para las funciones del mapper (carpeta hija ./mappers)
import { mapPedidoBackendToFrontend, mapCatalogoToFrontend } from "./mappers/pedidoMapper";

const API_URL = 'http://localhost:3000'; 

export const getPedidosService = async (): Promise<Pedido[]> => {
    const res = await fetch(`${API_URL}/pedidos`);
    if (!res.ok) throw new Error("Error al obtener pedidos");
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapPedidoBackendToFrontend) : [];
};

export const getCatalogoService = async (tipo: 'productos' | 'utensilios'): Promise<ItemCatalogo[]> => {
    const endpoint = tipo === 'productos' ? 'ingredientes' : 'utensilios';
    const res = await fetch(`${API_URL}/${endpoint}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map((d: any) => mapCatalogoToFrontend(d, tipo)) : [];
};

export const getProveedoresService = async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/proveedores`);
    return await res.json();
};

export const guardarPedidoService = async (payload: any) => {
    const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error al guardar");
    return await res.json();
};

export const eliminarPedidoService = async (id: string | number) => {
    await fetch(`${API_URL}/pedidos/${id}`, { method: 'DELETE' });
};