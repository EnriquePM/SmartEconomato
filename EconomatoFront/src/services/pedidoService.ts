// src/services/pedidoService.ts

import type { Pedido, ItemCatalogo } from "../models/Pedidos";
import { mapPedidoBackendToFrontend, mapCatalogoToFrontend } from "./mappers/pedidoMapper";
import { authFetch } from "./auth-service";

const API_URL = 'http://localhost:3000/api';

export const getPedidosService = async (): Promise<Pedido[]> => {
    const res = await authFetch(`${API_URL}/pedidos`);
    if (!res.ok) throw new Error("Error al obtener pedidos");
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapPedidoBackendToFrontend) : [];
};

export const getCatalogoService = async (tipo: 'productos' | 'utensilios'): Promise<ItemCatalogo[]> => {
    const endpoint = tipo === 'productos' ? 'ingredientes' : 'utensilios';
    const res = await authFetch(`${API_URL}/${endpoint}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map((d: any) => mapCatalogoToFrontend(d, tipo)) : [];
};

export const getProveedoresService = async (): Promise<any[]> => {
    const res = await authFetch(`${API_URL}/proveedores`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

export const guardarPedidoService = async (payload: any) => {
    // ---------------------------------------------------------
    // TODO: INTEGRACIÓN CON LOGIN
    // Cambiar este ID fijo por el ID del usuario real logueado.
    // Ejemplo: const { user } = useAuth(); const id = user.id;
    // ---------------------------------------------------------
    const ID_USUARIO_TEMPORAL = 1;

    const payloadConUsuario = {
        ...payload,
        id_usuario: ID_USUARIO_TEMPORAL,
        fecha_pedido: new Date(),
    };

    console.log("Enviando al backend:", payloadConUsuario);

    const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadConUsuario)
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Error devuelto por el servidor:", errorData);
        throw new Error(errorData.error || errorData.message || "Error desconocido al guardar");
    }

    return await res.json();
};

export const eliminarPedidoService = async (id: string | number) => {
    await fetch(`${API_URL}/pedidos/${id}`, { method: 'DELETE' });
};