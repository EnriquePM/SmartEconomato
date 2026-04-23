import { authFetch } from './auth-service';
import type { Alergeno, Categoria, Proveedor } from '../models/resources.model';

const API_URL = "/api";
export type { Alergeno, Categoria, Proveedor };

export const getCategorias = async (): Promise<Categoria[]> => {
    try {
        const res = await authFetch(`${API_URL}/categorias`);
        if (!res.ok) throw new Error("Error cargando categorias");
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
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
