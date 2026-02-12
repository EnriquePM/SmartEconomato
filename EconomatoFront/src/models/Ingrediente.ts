export interface Ingrediente {
  id_ingrediente: number;
  nombre: string;
  stock: number; 
  unidad_medida: string;
  precio_unidad: number;
  id_categoria: number;   
  id_proveedor: number;
}