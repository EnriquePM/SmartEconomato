import { useState, useEffect } from "react";
import { getProveedores } from "../services/proveedorService";
import type { ProveedorOption } from "../models/Proveedor";

export const useProveedores = () => {
  const [options, setOptions] = useState<ProveedorOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProveedores()
      .then(setOptions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { options, loading };
};