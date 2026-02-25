import { useState, useEffect, useCallback } from "react";
import { getIngredientes } from "../services/inventarioService";
import { getMateriales } from "../services/materialesService";
import type { ItemInventario } from "../models/ItemInventario";

export const useInventario = (vista: 'ingredientes' | 'utensilios') => {
  const [items, setItems] = useState<ItemInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usamos useCallback para que la función no se cree de nuevo en cada render
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null); // Limpiamos errores anteriores antes de intentar
    try {
      const data = vista === 'ingredientes' 
        ? await getIngredientes() 
        : await getMateriales();
      setItems(data);
    } catch (err) {
      setError("No se pudo establecer conexión con la base de datos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [vista]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return { items, loading, error, refetch: cargarDatos };
};