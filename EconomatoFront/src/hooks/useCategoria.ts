import { useState, useEffect } from "react";
import { getCategoria } from "../services/categoriaService";
import type { CategoriaOption } from "../models/Categoria";

export const useCategories = () => {
  const [options, setOptions] = useState<CategoriaOption[]>([]);
  
  useEffect(() => {
    // Si la carga falla, el array se queda vacío []
    getCategoria().then(setOptions).catch(() => setOptions([]));
  }, []);

  return options; 
};