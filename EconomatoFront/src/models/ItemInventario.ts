export interface ItemInventario {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  unidad_medida?: string;
}

export interface AvisoStock {
  nombre: string;
  badge: 'Stock Crítico' | 'Bajo Stock';
  color: 'orange' | 'yellow';
}