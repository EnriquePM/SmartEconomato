// src/services/usuarioService.ts
import type { Usuario, NuevoUsuarioPayload } from "../models/Usuario";
import { mapUsuarioToFrontend } from "./mappers/usuarioMapper";

const API_URL = "http://localhost:3000/api";

// GET: Traer todos los usuarios
export const getUsuariosService = async (): Promise<Usuario[]> => {
  const res = await fetch(`${API_URL}/usuarios`);
  if (!res.ok) throw new Error("Error al cargar usuarios");
  
  const data = await res.json();
  // Aplicamos el mapper a cada usuario recibido
  return Array.isArray(data) ? data.map(mapUsuarioToFrontend) : [];
};

// POST: Registrar nuevo usuario
export const registrarUsuarioService = async (rol: 'alumno' | 'profesor', datos: NuevoUsuarioPayload) => {
  // Lógica de endpoints separados
  const endpoint = rol === 'alumno' 
    ? `${API_URL}/auth/register/alumno`
    : `${API_URL}/auth/register/profesor`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al crear usuario");
  }

  return data;
};

// DELETE: Eliminar usuario (Opcional)
export const eliminarUsuarioService = async (id: number) => {
    await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
};