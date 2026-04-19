export interface Usuario {
  id: number;
  id_usuario?: number;
  username: string;
  nombre: string;
  apellido1: string;
  apellido2?: string | null;
  email?: string | null;
  rol: string;
}

export interface LoginResponse {
  requiereCambioPass: boolean;
  token?: string;
  usuario?: Usuario;
}

export interface LoginPayload {
  username: string;
  contrasenya: string;
}

export interface ChangePasswordPayload {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface RegisterUserPayload {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email?: string;
  curso?: string;
  asignaturas?: string;
}