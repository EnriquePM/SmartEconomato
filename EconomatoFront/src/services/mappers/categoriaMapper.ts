import type { Categoria, CategoriaOption } from "../../models/Categoria";

export const mapCategorias = (data: any[]): Categoria[] => {
  return data.map(cat => ({
    id: cat.id_categoria,
    nombre: cat.nombre
  }));
};

export const mapCategoriasOptions = (categorias: Categoria[]): CategoriaOption[] => {
  return categorias.map(cat => ({
    value: String(cat.id),
    label: cat.nombre
  }));
};