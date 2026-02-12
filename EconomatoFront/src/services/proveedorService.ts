import { mapApiToProveedorOptions } from "./mappers/proveedorMapper";

export const getProveedores = async () => {
  const response = await fetch("http://localhost:3000/proveedor");
  if (!response.ok) throw new Error("Error al traer proveedores");
  const data = await response.json();
  return mapApiToProveedorOptions(data);
};