import { recetaMapper } from "./mappers/recetaMapper";
import type { Receta } from "../models/Receta";

const API_URL = "/api";

const getErrorMessage = async (res: Response, fallback: string): Promise<string> => {
  const payload = await res.json().catch(() => null);
  return payload?.error || payload?.mensaje || fallback;
};

// Funcion de ayuda para no repetir los headers y el token en cada peticion
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const recetaService = {
  // 1. Obtener todas las recetas
  async getAll(): Promise<Receta[]> {
    const res = await fetch(`${API_URL}/recetas`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al obtener recetas"));

    const data = await res.json();
    // Aqui usamos el Traductor (Mapper) del Paso 1 para limpiar los datos
    return data.map((item: any) => recetaMapper.fromJson(item));
  },

  // 2. Obtener una receta concreta por ID
  async getById(id: number): Promise<Receta> {
    const res = await fetch(`${API_URL}/recetas/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al obtener el detalle de la receta"));

    const data = await res.json();
    return recetaMapper.fromJson(data);
  },

  // 3. Crear una nueva receta
  async create(receta: Partial<Receta>): Promise<Receta> {
    const res = await fetch(`${API_URL}/recetas`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(receta),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al crear la receta"));

    const data = await res.json();
    return recetaMapper.fromJson(data);
  },

  // 4. Actualizar una receta
  async update(id: number, receta: Partial<Receta>): Promise<Receta> {
    const res = await fetch(`${API_URL}/recetas/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(receta),
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al actualizar la receta"));

    const data = await res.json();
    return recetaMapper.fromJson(data);
  },

  // 5. Eliminar receta
  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/recetas/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al eliminar la receta"));
  },

  // 6. Elaborar una receta y descontar inventario
  async makeReceta(id: number, raciones: number): Promise<void> {
    const res = await fetch(`${API_URL}/recetas/${id}/hacer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ raciones })
    });

    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al elaborar la receta"));
  },

  // 7. Obtener ingredientes para el buscador del modal
  async getIngredientesDisponibles() {
    const res = await fetch(`${API_URL}/ingredientes`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await getErrorMessage(res, "Error al obtener ingredientes"));
    return await res.json();
  }
};
