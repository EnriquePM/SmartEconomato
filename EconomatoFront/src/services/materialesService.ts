import { authFetch } from './auth-service';
import type { ItemInventario } from '../models/ItemInventario';

const API_URL = '/api';

export const getMateriales = async (): Promise<ItemInventario[]> => {
  try {
    const res = await authFetch(`${API_URL}/materiales`);
    if (!res.ok) throw new Error('Error cargando materiales');
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id_material,
      nombre: item.nombre,
      precio: Number(item.precio_unidad ?? 0),
      stock: Number(item.stock ?? 0),
      unidad_medida: item.unidad_medida ?? 'ud',
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

