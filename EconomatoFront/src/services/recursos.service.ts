// src/services/recursos.service.ts

import { authFetch } from './auth-service';

const API_URL = "http://localhost:3000/api";
// Definimos qué forma tienen los datos que vienen del backend
export interface Categoria {
    id_categoria: number;
    nombre: string;
}

export interface Proveedor {
    id_proveedor: number;
    nombre: string;
}

export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const res = await authFetch(`${API_URL}/categorias`);
        if (!res.ok) throw new Error("Error cargando categorías");
        return await res.json();
    } catch (error) {
        console.error(error);
        return []; // Si falla, devolvemos lista vacía
    }
};

export const getProveedores = async (): Promise<Proveedor[]> => {
    try {
        const res = await authFetch(`${API_URL}/proveedores`);
        if (!res.ok) throw new Error("Error cargando proveedores");
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};