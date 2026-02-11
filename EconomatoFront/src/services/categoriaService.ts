import { mapApiToCategoryOptions } from "./mappers/categoriaMapper";

export const getCategoria = async () => {
  const response = await fetch("http://localhost:3000/categoria");
  if (!response.ok) throw new Error("Error al traer categorías");
  const data = await response.json();
  return mapApiToCategoryOptions(data);
};