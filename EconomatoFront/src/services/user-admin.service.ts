import { authFetch } from "./auth-service";
import type { RegisterUserPayload, Usuario } from "../models/user.model";

const API_URL = "/api";

const parseJson = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === "object") {
    const raw = (payload as Record<string, unknown>).error ??
      (payload as Record<string, unknown>).mensaje;
    if (typeof raw === "string" && raw.trim()) {
      return raw;
    }
  }
  return fallback;
};

type RawUsuario = Omit<Partial<Usuario>, "rol"> & {
  rol?: string | { nombre?: string };
};

const mapUsuario = (usuario: RawUsuario): Usuario => {
  const rol = typeof usuario.rol === "string" ? usuario.rol : usuario.rol?.nombre || "Alumno";
  return {
    id: usuario.id ?? usuario.id_usuario ?? 0,
    id_usuario: usuario.id_usuario,
    username: usuario.username || "",
    nombre: usuario.nombre || "",
    apellido1: usuario.apellido1 || "",
    apellido2: usuario.apellido2,
    email: usuario.email,
    rol,
  };
};

export const getUsuariosAdmin = async (): Promise<Usuario[]> => {
  const response = await authFetch(`${API_URL}/usuarios`);
  const data = await parseJson<Usuario[]>(response);

  if (!response.ok || !data) {
    throw new Error(getErrorMessage(data, "Error al cargar usuarios"));
  }

  return data.map((item) => mapUsuario(item));
};

const createUserByRole = async (rolePath: "alumno" | "profesor", payload: RegisterUserPayload): Promise<Usuario> => {
  const response = await authFetch(`${API_URL}/auth/register/${rolePath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseJson<Usuario>(response);

  if (!response.ok || !data) {
    throw new Error(getErrorMessage(data, "Error al crear usuario"));
  }

  return mapUsuario(data);
};

export const createAlumno = (payload: RegisterUserPayload) => createUserByRole("alumno", payload);

export const createProfesor = (payload: RegisterUserPayload) => createUserByRole("profesor", payload);
