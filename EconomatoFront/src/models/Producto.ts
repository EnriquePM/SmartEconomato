export interface Producto {
  id: string;
  nombre: string;
  imagen: string;
  stock: number;         
  stockMinimo: number;
  tipo: string;
  categoria: string;    
  proveedor: string;     
}