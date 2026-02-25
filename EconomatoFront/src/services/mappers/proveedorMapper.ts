import type { Proveedor, ProveedorOption } from "../../models/Proveedor";

export const mapProveedores = (data: any[]): Proveedor[] => {
  return data.map(p => ({
    id_proveedor: p.id_proveedor, 
    nombre: p.nombre
  }));
};


export const mapProveedoresOptions = (proveedores: Proveedor[]): ProveedorOption[] => {
  return proveedores.map(p => ({
    value: String(p.id_proveedor),
    label: p.nombre
  }));
};