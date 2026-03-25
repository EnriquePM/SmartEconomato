import type { Acceso, ActividadReciente } from "../models/home.model";
import { Users, ShoppingCart, Package, Archive } from "lucide-react";

export const getAccesos = async (): Promise<Acceso[]> => {
  return [
    { titulo: "Gestión Usuarios", icono: Users, color: "bg-blue-600", ruta: "/admin-usuarios" },
    { titulo: "Nuevo Pedido", icono: ShoppingCart, color: "bg-orange-500", ruta: "/pedidos" },
    { titulo: "Inventario", icono: Package, color: "bg-emerald-500", ruta: "/inventario" },
    { titulo: "Entrada Stock", icono: Archive, color: "bg-purple-500", ruta: "/registrar-general" },
  ];
};

export const getActividadReciente = async (): Promise<ActividadReciente[]> => {
  try {
    const token = localStorage.getItem("token"); 
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    const [resPedidos, resIngredientes, resMateriales] = await Promise.all([
      fetch("http://localhost:3000/api/pedidos", { headers }).catch(() => null),
      fetch("http://localhost:3000/api/ingredientes", { headers }).catch(() => null),
      fetch("http://localhost:3000/api/materiales", { headers }).catch(() => null)
    ]);

    const pedidos = resPedidos?.ok ? await resPedidos.json() : [];
    const ingredientes = resIngredientes?.ok ? await resIngredientes.json() : [];
    const materiales = resMateriales?.ok ? await resMateriales.json() : [];

    const actividadMixta: ActividadReciente[] = [];

    // --- A. Un pedido pendiente ---
    const pedidoPendiente = pedidos.find((p: any) => p.estado === "PENDIENTE") || pedidos[0];
    if (pedidoPendiente) {
      actividadMixta.push({
        id: 1,
        titulo: `Pedido #${pedidoPendiente.id_pedido || pedidoPendiente.id || 'Nuevo'}`,
        sub: `Estado: ${pedidoPendiente.estado}`,
        tipo: "pedido",
        estado: pedidoPendiente.estado === "PENDIENTE" ? "warning" : "info",
        hora: "Reciente"
      });
    }

    // --- B. Varios ingredientes normales AL AZAR (Cogemos hasta 3) ---
    const ingredientesSanos = ingredientes
      .filter((i: any) => (i.stock || i.cantidad) >= 5)
      .sort(() => 0.5 - Math.random()) // 🎲 Aquí barajamos la lista
      .slice(0, 3);
      
    ingredientesSanos.forEach((alimento: any, index: number) => {
      actividadMixta.push({
        id: 20 + index,
        titulo: `Stock: ${alimento.nombre}`,
        sub: `Quedan ${alimento.stock || alimento.cantidad || 0} uds/kg`,
        tipo: "stock",
        estado: "success",
        hora: "Al día"
      });
    });

    // --- C. Alertas de Stock crítico AL AZAR (Cogemos hasta 2) ---
    const ingredientesCriticos = ingredientes
      .filter((i: any) => (i.stock || i.cantidad) < 5)
      .sort(() => 0.5 - Math.random()) // 🎲 Barajamos también las alertas
      .slice(0, 2);
      
    ingredientesCriticos.forEach((critico: any, index: number) => {
      actividadMixta.push({
        id: 30 + index,
        titulo: `¡Alerta! ${critico.nombre}`,
        sub: `Solo quedan ${critico.stock || critico.cantidad} uds.`,
        tipo: "alerta",
        estado: "danger",
        hora: "¡Revisar!"
      });
    });

    // --- D. Varios Utensilios / Materiales AL AZAR (Cogemos hasta 2) ---
    const materialesRecientes = materiales
      .sort(() => 0.5 - Math.random()) // 🎲 Barajamos los utensilios
      .slice(0, 2);
      
    materialesRecientes.forEach((material: any, index: number) => {
      actividadMixta.push({
        id: 40 + index,
        titulo: `Utensilio: ${material.nombre}`,
        sub: `Disponibles: ${material.stock || material.cantidad || 0}`,
        tipo: "stock",
        estado: "info",
        hora: "Inventario"
      });
    });

    if (actividadMixta.length === 0) {
      return [{
        id: 999, titulo: "Sistema iniciado", sub: "Aún no hay actividad", tipo: "info", estado: "success", hora: "Ahora"
      }];
    }

    return actividadMixta;

  } catch (error) {
    console.error("Fallo al traer datos reales:", error);
    return [{
      id: 999, titulo: "Error de conexión", sub: "No se pudieron cargar los datos", tipo: "alerta", estado: "danger", hora: "Ahora"
    }];
  }
};