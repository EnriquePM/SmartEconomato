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
