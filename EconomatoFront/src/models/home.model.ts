import type{ ElementType } from "react";

export interface Acceso {
  titulo: string;
  icono: ElementType;
  color: string;
  ruta: string;
}

export type EstadoActividad = "warning" | "success" | "danger" | "info";
export type TipoActividad = "pedido" | "stock" | "alerta" | "user";

export interface ActividadReciente {
  id: number;
  titulo: string;
  sub: string;
  tipo: TipoActividad;
  estado: EstadoActividad;
  hora: string;
}