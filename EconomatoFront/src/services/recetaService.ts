import { recetaMapper } from "./mappers/recetaMapper";
import type { Receta } from "../models/Receta";

const API_URL = "http://localhost:3000/api";

// Función de ayuda para no repetir los headers y el token en cada petición
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
    if (!res.ok) throw new Error("Error al obtener recetas");
    
    const data = await res.json();
    // Aquí usamos el Traductor (Mapper) del Paso 1 para limpiar los datos
    return data.map((item: any) => recetaMapper.fromJson(item));
  },

  // 2. Crear una nueva receta
  async create(receta: Partial<Receta>): Promise<void> {
    const res = await fetch(`${API_URL}/recetas`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(receta),
    });
    if (!res.ok) throw new Error("Error al crear la receta");
  },

  // 3. Obtener ingredientes para el buscador del modal
  async getIngredientesDisponibles() {
    const res = await fetch(`${API_URL}/ingredientes`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Error al obtener ingredientes");
    return await res.json();
  }
};