import { useState, useEffect } from "react";
import type { Acceso, ActividadReciente } from "../models/home.model";
import { getAccesos, getActividadReciente } from "../services/home.services";

export const useHome = () => {
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [actividadReciente, setActividadReciente] = useState<ActividadReciente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [dataAccesos, dataActividad] = await Promise.all([
          getAccesos(),
          getActividadReciente()
        ]);
        
        setAccesos(dataAccesos);
        setActividadReciente(dataActividad);
      } catch (error) {
        console.error("Error al cargar los datos del Home:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return {
    accesos,
    actividadReciente,
    cargando
  };
};