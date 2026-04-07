import { authFetch } from './auth-service';
import type { ItemInventario } from '../models/ItemInventario';

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
      unidad_medida: item.unidad_medida ?? 'ud',
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
