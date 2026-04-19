export type InventarioVista = 'ingredientes' | 'utensilios';

export interface AlergenoInventario {
  id_alergeno: number;
  nombre: string;
  icono?: string | null;
}

export interface InventarioItem {
  id: number | string;
  codigo?: string;
  nombre: string;
  stock: number;
  unidad_medida?: string;
  precio?: number;
  id_categoria: number | null;
  categoria_nombre?: string;
  id_proveedor?: number;
  alergenos?: AlergenoInventario[];
}

export interface SelectOption {
  value: string;
  label: string;
}
