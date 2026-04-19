import { authFetch } from './auth-service';
import type { ItemInventario } from '../models/ItemInventario';
import type { AvisoStock } from '../models/ItemInventario';

const API_URL = '/api';
const API_URL = 'http://localhost:3000/api';


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