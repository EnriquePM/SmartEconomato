import { authFetch } from './auth-service';
import type { ItemInventario } from '../models/ItemInventario';
import type { AvisoStock } from '../models/ItemInventario';
import type { InventarioItem } from '../models/inventory.model';

const API_URL = '/api';


export const getIngredientes = async (): Promise<ItemInventario[]> => {
  try {
    const res = await authFetch(`${API_URL}/ingredientes`);
    if (!res.ok) throw new Error('Error cargando ingredientes');
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id_ingrediente,
      nombre: item.nombre,
      precio: Number(item.precio_unidad ?? 0),
      stock: Number(item.stock ?? 0),
      stock_minimo: Number(item.stock_minimo ?? 0),
      unidad_medida: item.unidad_medida ?? 'ud',
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAvisosStock = async (): Promise<AvisoStock[]> => {
  const ingredientes = await getIngredientes();

  return ingredientes
    .filter(i => i.stock_minimo > 0 && i.stock <= i.stock_minimo * 1.5)
    .map(i => ({
      nombre: i.nombre,
      badge: (i.stock <= i.stock_minimo ? 'Stock Crítico' : 'Bajo Stock') as AvisoStock['badge'],
      color: (i.stock <= i.stock_minimo ? 'orange' : 'yellow') as AvisoStock['color'],
    }))
    .sort((a) => (a.color === 'orange' ? -1 : 1));
};

export const getInventarioIngredientes = async (): Promise<InventarioItem[]> => {
  const res = await authFetch(`${API_URL}/ingredientes`);
  if (!res.ok) throw new Error('Error cargando ingredientes');

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    id: item.id_ingrediente,
    nombre: item.nombre,
    codigo: item.codigo || String(item.id_ingrediente),
    stock: Number(item.stock_actual ?? item.stock ?? 0),
    stock_minimo: Number(item.stock_minimo ?? 0),
    unidad_medida: item.unidad_medida || 'ud',
    precio: Number(item.precio_unidad ?? 0),
    id_categoria: item.id_categoria ?? null,
    categoria_nombre: item.categoria?.nombre || 'Sin categoría',
    id_proveedor: item.id_proveedor,
    fecha_caducidad: item.fecha_caducidad ?? null,
    alergenos: Array.isArray(item.alergenos)
      ? item.alergenos.map((al: any) => ({
          id_alergeno: al.id_alergeno,
          nombre: al.nombre,
          icono: al.icono ?? null
        }))
      : []
  }));
};

export const getInventarioMateriales = async (): Promise<InventarioItem[]> => {
  const res = await authFetch(`${API_URL}/materiales`);
  if (!res.ok) throw new Error('Error cargando materiales');

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    id: item.id_material,
    nombre: item.nombre,
    codigo: `MAT-${item.id_material}`,
    stock: Number(item.stock ?? 0),
    stock_minimo: Number(item.stock_minimo ?? 0),
    unidad_medida: item.unidad_medida || 'ud',
    id_categoria: item.id_categoria ?? null,
    categoria_nombre: item.categoria?.nombre || 'Sin categoría',
    precio: Number(item.precio_unidad ?? 0)
  }));
};