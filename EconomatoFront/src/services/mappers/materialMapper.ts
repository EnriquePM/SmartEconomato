import type { Material } from "../../models/Materiales";
import type { ItemInventario } from "../../models/ItemInventario";

export const mapMaterial = (data: Material[]): ItemInventario[] => {
  return data.map(m => ({
    id: m.id_material,
    nombre: m.nombre,
    stock: m.stock, 
    unidad: m.unidad_medida || 'u.',
    precio: Number(m.precio_unidad),
    id_categoria: m.id_categoria || 0,
    id_proveedor: m.id_proveedor || 0,
    tipo: 'material'
  }));
};