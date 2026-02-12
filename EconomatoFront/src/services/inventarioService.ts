
import { mapIngredienteToProducto } from "./mappers/inventarioMapper";
import type { Producto } from "../models/Producto";

// Cargar datos de todo el inventario
export const getInventarioCompleto = async (): Promise<Producto[]> => {
  // 1. Lanzamos las 3 peticiones a la vez (paralelo)
  // Esto simula lo que en el futuro hará una sola consulta a la BBDD
  const [resIng, resCat, resProv] = await Promise.all([
    fetch("http://localhost:3000/ingrediente"),
    fetch("http://localhost:3000/categoria"),
    fetch("http://localhost:3000/proveedor")
  ]);


  const ingredientes = await resIng.json();
  const categorias = await resCat.json();
  const proveedores = await resProv.json();


  if (!Array.isArray(ingredientes)) return [];

  return ingredientes.map((ing: any) => 
    mapIngredienteToProducto(ing, categorias, proveedores)
  );
};

//Crear un nuevo ingrediente
export const crearIngrediente = async (producto: Producto) => {
  const respuesta = await fetch("http://localhost:3000/ingrediente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });

  if (!respuesta.ok) throw new Error("No se pudo guardar el ingrediente");
  
  return await respuesta.json();
};

