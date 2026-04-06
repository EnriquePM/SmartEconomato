import type { Receta, RecetaIngrediente } from "../../models/Receta";

export const recetaMapper = {
  /**
   * Transforma el JSON que llega del servidor al modelo exacto que necesita nuestro Frontend.
   * Si el servidor no envía algún dato, le ponemos un valor por defecto para que no "pete" la pantalla.
   */
  fromJson(json: any): Receta {
    return {
      id_receta: json.id_receta,
      nombre: json.nombre || "Receta sin nombre",
      descripcion: json.descripcion || "",
      cantidad_platos: json.cantidad_platos || 1,
      fecha_creacion: json.fecha_creacion,
      receta_ingrediente: Array.isArray(json.receta_ingrediente)
        ? json.receta_ingrediente.map((ri: any): RecetaIngrediente => ({
          id_ingrediente: ri.id_ingrediente,
          cantidad: Number(ri.cantidad) || 0,
          rendimiento: Number(ri.rendimiento) || 100,
          ingrediente: ri.ingrediente ? {
            nombre: ri.ingrediente.nombre || "Desconocido",
            unidad_medida: ri.ingrediente.unidad_medida || "ud",
            stock: ri.ingrediente.stock !== undefined ? Number(ri.ingrediente.stock) : undefined,
            // Cuidado aquí: mapeamos 'precio_unidad' de la base de datos a 'precio_unitario' del front
            precio_unitario: ri.ingrediente.precio_unidad ? Number(ri.ingrediente.precio_unidad) : undefined
          } : undefined
        }))
        : []
    };
  }
};