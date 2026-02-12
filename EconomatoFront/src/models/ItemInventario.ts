export interface ItemInventario {
  id: number;
  nombre: string;
  stock: number;
  unidad: string;
  precio: number;
  id_categoria: number;
  id_proveedor: number;
  tipo: 'ingrediente' | 'material';
}