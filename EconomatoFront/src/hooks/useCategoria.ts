import { useState, useEffect } from "react";
import { getCategoria } from "../services/categoriaService";
import type { Categoria, CategoriaOption } from "../models/Categoria";
import { mapCategoriasOptions } from "../services/mappers/categoriaMapper";


export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [options, setOptions] = useState<CategoriaOption[]>([]);

  useEffect(() => {
    getCategoria()
      .then(data => {
        setCategorias(data);
        setOptions(mapCategoriasOptions(data));
      })
      .catch(console.error);
  }, []);

  return { categorias, options };
};