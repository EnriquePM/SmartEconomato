import { mapMaterial } from "./mappers/materialMapper";

const API_URL = "http://localhost:3000/api/materiales";

export const getMateriales = async () => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Error en materiales");
  const data = await res.json();
  return mapMaterial(data);
};