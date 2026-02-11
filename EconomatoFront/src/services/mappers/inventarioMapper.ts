import type { Producto } from "../../models/Producto";

export const mapIngredienteToProducto = (
  ingrediente: any, 
  categorias: any[], 
  proveedores: any[]
): Producto => {
  
  // Buscamos el nombre de la categoría por su ID
  const categoriaEncontrada = categorias.find(
    c => c.id_categoria === ingrediente.id_categoria
  );

  // Buscamos el nombre del proveedor por su ID
  const proveedorEncontrado = proveedores.find(
    p => p.id_proveedor === ingrediente.id_proveedor
  );

  return {
    id: ingrediente.id_ingrediente,
    nombre: ingrediente.nombre,
    imagen: ingrediente.imagen,
    // Convertimos "50.00" (string) a 50 (number) para poder hacer cálculos matemáticos
    stock: parseFloat(ingrediente.stock), 
    stockMinimo: parseFloat(ingrediente.stock_minimo),
    tipo: ingrediente.tipo,
    // Si no encuentra la categoría, ponemos "Sin Categoría" por seguridad
    categoria: categoriaEncontrada ? categoriaEncontrada.nombre : "Sin Categoría",
    proveedor: proveedorEncontrado ? proveedorEncontrado.nombre : "Desconocido"
  };
};