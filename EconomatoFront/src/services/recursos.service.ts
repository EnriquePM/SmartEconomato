// src/services/recursos.service.ts

import { authFetch } from './auth-service';

const API_URL = "/api";
// Definimos que forma tienen los datos que vienen del backend
export interface Categoria {
    id_categoria: number;
    nombre: string;
}

export interface Proveedor {
    id_proveedor: number;
    nombre: string;
}

export interface Alergeno {
    id_alergeno: number;
    nombre: string;
    icono: string | null;
}

export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const res = await authFetch(`${API_URL}/categorias`);
        if (!res.ok) throw new Error("Error cargando categorias");
        return await res.json();
    } catch (error) {
        console.error(error);
        return []; // Si falla, devolvemos lista vacia
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

export const getAlergenos = async (): Promise<Alergeno[]> => {
    try {
        const res = await authFetch(`${API_URL}/alergenos`);
        if (!res.ok) throw new Error("Error cargando alergenos");
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};
