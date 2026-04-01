import { useState, useEffect, useMemo } from "react";
import type { Receta } from "../models/Receta";
import { recetaService } from "../services/recetaService";

// --- LA RECETA DE PRUEBA VUELVE TEMPORALMENTE ---
const RECETA_DE_PRUEBA: Receta = {
  id_receta: 1,
  nombre: "Sopa de Tomate Pro",
  descripcion: "1 tomate, 2 litros de agua, 1 piña",
  cantidad_platos: 4,
  receta_ingrediente: [
    { id_ingrediente: 101, cantidad: 1000, rendimiento: 100, ingrediente: { nombre: "Tomate Pera", unidad_medida: "g" } },
    { id_ingrediente: 102, cantidad: 200, rendimiento: 100, ingrediente: { nombre: "Cebolla", unidad_medida: "g" } },
    { id_ingrediente: 103, cantidad: 2, rendimiento: 100, ingrediente: { nombre: "Ajo", unidad_medida: "ud" } }
  ]
};

export const useRecetas = () => {
  // --- ESTADOS (Empezamos con la receta de prueba por si el back tarda) ---
  const [recetas, setRecetas] = useState<Receta[]>([RECETA_DE_PRUEBA]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // --- LÓGICA DE CARGA ---
  const fetchRecetas = async () => {
    try {
      setCargando(true);
      const data = await recetaService.getAll(); 
      // Si el back funciona, mezclamos la de prueba con las reales
      setRecetas([RECETA_DE_PRUEBA, ...data]);
    } catch (error) {
      console.error("El backend aún no responde, usando datos de prueba.", error);
      // Si falla, nos aseguramos de que siga saliendo la nuestra
      setRecetas([RECETA_DE_PRUEBA]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchRecetas();
  }, []);

  // --- LÓGICA DE FILTRADO ---
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
    refrescar: fetchRecetas, 
  };
};