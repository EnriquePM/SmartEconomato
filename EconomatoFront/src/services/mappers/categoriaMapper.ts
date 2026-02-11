import type { CategoriaOption } from "../../models/Categoria";

export const mapApiToCategoryOptions = (apiData: any[]): CategoriaOption[] => {
  return apiData.map(cat => ({
    value: String(cat.id_categoria),
    label: cat.nombre
  }));
};