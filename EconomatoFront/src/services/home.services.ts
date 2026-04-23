// src/services/home.services.ts
import type { Acceso, ActividadReciente } from "../models/home.model";
import { ConciergeBell, ShoppingCart, Package, Archive } from "lucide-react";

// --- ACCESOS ---
export const getAccesos = async (): Promise<Acceso[]> => {
  return [
    { 
      titulo: "Recepcion",            
      icono: ConciergeBell,           
      color: "bg-sky-500",            
      ruta: "/recepcion"              
    },
    { titulo: "Nuevo Pedido", icono: ShoppingCart, color: "bg-orange-500", ruta: "/pedidos" },
    { titulo: "Inventario", icono: Package, color: "bg-emerald-500", ruta: "/inventario" },
    { titulo: "Entrada Stock", icono: Archive, color: "bg-purple-500", ruta: "/registrar-general" },
  ];
};

// --- ACTIVIDAD RECIENTE (Solo Stock y Utensilios) ---
export const getActividadReciente = async (): Promise<ActividadReciente[]> => {
  try {
    const token = sessionStorage.getItem("token"); 
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    // 1. Ya no hacemos fetch a pedidos, solo a ingredientes y materiales
    const [resIngredientes, resMateriales] = await Promise.all([
      fetch("/api/ingredientes", { headers }).catch(() => null),
      fetch("/api/materiales", { headers }).catch(() => null)
    ]);

    const ingredientes = resIngredientes?.ok ? await resIngredientes.json() : [];
    const materiales = resMateriales?.ok ? await resMateriales.json() : [];

    const actividadMixta: ActividadReciente[] = [];

    // --- A. Varios ingredientes normales AL AZAR (Subimos a 4 para compensar) ---
    const ingredientesSanos = ingredientes
      .filter((i: any) => (i.stock || i.cantidad) >= 5)
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 4);
      
    ingredientesSanos.forEach((alimento: any, index: number) => {
      actividadMixta.push({
        id: Number(alimento.id_ingrediente ?? (index + 1)),
        titulo: `Stock: ${alimento.nombre}`,
        sub: `Quedan ${alimento.stock || alimento.cantidad || 0} ${alimento.unidad_medida || 'uds'}`,
        tipo: "stock",
        estado: "success",
        hora: "Al dia"
      });
    });

    // --- B. Alertas de Stock critico AL AZAR (Max 2) ---
    const ingredientesCriticos = ingredientes
      .filter((i: any) => (i.stock || i.cantidad) < 5)
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 2);
      
    ingredientesCriticos.forEach((critico: any, index: number) => {
      actividadMixta.push({
        id: Number(critico.id_ingrediente ?? (1000 + index)),
        titulo: `!Alerta! ${critico.nombre}`,
        sub: `Solo quedan ${critico.stock || critico.cantidad} ${critico.unidad_medida || 'uds'}`,
        tipo: "alerta", 
        estado: "danger",
        hora: "!Revisar!"
      });
    });

    // --- C. Varios Utensilios / Materiales AL AZAR (Max 2) ---
    const materialesRecientes = materiales
      .sort(() => 0.5 - Math.random()) 
      .slice(0, 2);
      
    materialesRecientes.forEach((material: any, index: number) => {
      actividadMixta.push({
        id: Number(material.id_material ?? material.id ?? (2000 + index)),
        titulo: `Utensilio: ${material.nombre}`,
        sub: `Disponibles: ${material.stock || material.cantidad || 0}`,
        tipo: "stock",
        estado: "info",
        hora: "Inventario"
      });
    });

    if (actividadMixta.length === 0) {
      return [{
        id: 999001,
        titulo: "Sistema iniciado",
        sub: "Aun no hay actividad",
        tipo: "stock",
        estado: "success",
        hora: "Ahora"
      }];
    }

    // pilla los productos al azar 
    return actividadMixta.sort(() => 0.5 - Math.random());

  } catch (error) {
    console.error("Fallo al traer datos reales:", error);
    return [{
      id: 999002,
      titulo: "Error de conexion",
      sub: "No se pudieron cargar los datos",
      tipo: "alerta",
      estado: "danger",
      hora: "Ahora"
    }];
  }
};
