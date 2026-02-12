import type { ProveedorOption } from "../../models/Proveedor";

export const mapApiToProveedorOptions = (apiData: any[]): ProveedorOption[] => {
  return apiData.map(prov => ({
    value: String(prov.id_proveedor),
    label: prov.nombre
  }));
};