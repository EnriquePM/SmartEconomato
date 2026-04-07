export interface Alergeno {
  id_alergeno: number;
  nombre: string;
  icono: string | null;
}

export interface RecetaAlergeno {
  id_receta: number;
  id_alergeno: number;
  alergeno: Alergeno;
}

export interface Receta {
  id_receta?: number;
  nombre: string;
  descripcion?: string;
  cantidad_platos: number;
  fecha_creacion?: string;
  receta_ingrediente: RecetaIngrediente[];
  receta_alergeno?: RecetaAlergeno[];
}

export interface RecetaIngrediente {
  id_ingrediente: number;
  cantidad: number;
  rendimiento: number;
  ingrediente?: {
    nombre: string;
    unidad_medida: string;
    stock?: number;
    precio_unitario?: number;
  };
}