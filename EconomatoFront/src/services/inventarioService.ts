
import { mapIngrediente } from "./mappers/ingredienteMapper";

const API_URL = "http://localhost:3000/api/ingredientes";

export const getIngredientes = async () => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Error en ingredientes");
  const data = await res.json();
  return mapIngrediente(data);
};


