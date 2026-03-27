// src/hooks/useHome.ts
import { useState, useEffect } from "react";
// 👉 Importamos tus dos funciones reales que ya tienes en tus servicios
import { getAccesos, getActividadReciente } from "../services/home.services"; 

export const useHome = () => {
  const [accesos, setAccesos] = useState<any[]>([]);
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Traemos los botones de arriba
        const accesosData = await getAccesos();
        setAccesos(accesosData);

        // 2. Traemos LA ACTIVIDAD REAL (Esto llama a tu fetch real de home.services.ts)
        const actividadReal = await getActividadReciente();
        
        // 3. Opcional: Como ya me dijiste que querías 5 en vez de 4, si por algún 
        // motivo de tu servicio vienen más de 5, aquí los cortamos para que quede bonito.
        // (Tu servicio ya los baraja por dentro, así que aquí solo cortamos).
        const soloCinco = actividadReal.slice(0, 5);

        // 4. Se lo damos al diseño
        setActividadReciente(soloCinco);

      } catch (error) {
        console.error("Error cargando el Home:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return { accesos, actividadReciente, cargando };
};