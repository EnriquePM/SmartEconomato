// src/models/Usuario.ts
export interface Usuario {
  id_usuario: number;
  username: string;
  nombre: string;
  apellido1: string;
  apellido2: string | null;
  email: string | null;
  id_rol: number;
  rol?: { nombre: string };
  alumnado?: { curso: string | null };
  profesorado?: { asignaturas: string | null };
}

export interface NuevoUsuarioPayload {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email?: string;
  curso?: string;
  asignaturas?: string;
}