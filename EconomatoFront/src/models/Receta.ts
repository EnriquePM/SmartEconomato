export  interface Receta {
  id_receta?: number;
  nombre: string;
  descripcion?: string;
  cantidad_platos: number;
  fecha_creacion?: string;
  receta_ingrediente: RecetaIngrediente[];
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