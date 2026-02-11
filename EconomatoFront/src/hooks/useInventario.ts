import { useState, useEffect } from "react";
import { getInventarioCompleto } from "../services/inventarioService";
import type { Producto } from "../models/Producto";

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInventarioCompleto();
      setProductos(data);
    } catch (err) {
      setError("No se pudo cargar el inventario. Inténtalo de nuevo más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    productos,
    loading,
    error,
    refetch: cargarDatos // Por si quieres un botón de "actualizar"
  };
};