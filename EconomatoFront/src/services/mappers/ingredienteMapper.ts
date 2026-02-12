import type { Ingrediente} from "../../models/Ingrediente";
import type { ItemInventario } from "../../models/ItemInventario";

export const mapIngrediente = (data: Ingrediente[]): ItemInventario[] => {
  return data.map(i => ({
    id: i.id_ingrediente,
    nombre: i.nombre,
    stock: Number(i.stock), // Forzamos Number por si el Decimal de Prisma llega como string
    unidad: i.unidad_medida || 'u.',
    precio: Number(i.precio_unidad),
    id_categoria: i.id_categoria || 0,
    id_proveedor: i.id_proveedor || 0,
    tipo: 'ingrediente'
  }));
};

