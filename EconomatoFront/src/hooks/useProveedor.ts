import { useState, useEffect } from "react";
import { getProveedores } from "../services/proveedorService"; 
import type { Proveedor, ProveedorOption } from "../models/Proveedor";
import { mapProveedoresOptions } from "../services/mappers/proveedorMapper";

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [options, setOptions] = useState<ProveedorOption[]>([]);

  useEffect(() => {
    getProveedores()
      .then(data => {
        setProveedores(data);
        setOptions(mapProveedoresOptions(data));
      })
      .catch(console.error);
  }, []);

  return { proveedores, options };
};