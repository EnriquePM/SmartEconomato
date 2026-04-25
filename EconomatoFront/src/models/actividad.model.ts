export interface RegistroActividad {
  id_log: number;
  id_usuario: number | null;
  nombre_usuario: string;
  accion: string;
  entidad: string;
  id_entidad: number | null;
  descripcion: string | null;
  ruta: string | null;
  fecha: string;
}
