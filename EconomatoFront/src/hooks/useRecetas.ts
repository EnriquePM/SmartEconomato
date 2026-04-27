import { useState, useEffect, useMemo } from "react";
import type { Receta } from "../models/Receta";
import { recetaService } from "../services/recetaService";

export const useRecetas = () => {

  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRecetas = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await recetaService.getAll();
      setRecetas(data);
    } catch (err: any) {
      console.error("Error cargando recetas:", err);
      setRecetas([]);
      setError(err?.message || "No se pudieron cargar las recetas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchRecetas();
  }, []);


  const recetasFiltradas = useMemo(() => {
    return recetas.filter((r) =>
      r.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [recetas, busqueda]);

  return {
    recetasFiltradas,
    busqueda,
    setBusqueda,
    cargando,
    error,
    refrescar: fetchRecetas,
  };
};