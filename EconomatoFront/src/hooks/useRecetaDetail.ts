import { useMemo, useState } from "react";
import type { Receta } from "../models/Receta";
import { recetaService } from "../services/recetaService";

export type ConsumoIngrediente = {
  id_ingrediente: number;
  nombre: string;
  unidad: string;
  necesaria: number;
  disponible: number;
};

export const useRecetaDetail = (receta: Receta) => {
  const [racionesDeseadas, setRacionesDeseadas] = useState<number>(
    Math.max(1, Number(receta.cantidad_platos || 1))
  );
  const [elaborando, setElaborando] = useState(false);

  const listaIngredientes = receta.receta_ingrediente || [];

  const consumos = useMemo<ConsumoIngrediente[]>(() => {
    const platosOriginales = Math.max(1, Number(receta.cantidad_platos || 1));
    const factor = racionesDeseadas / platosOriginales;

    return listaIngredientes.map((ri) => {
      const rendimiento = Number(ri.rendimiento || 100);
      const rendimientoFactor = rendimiento > 0 ? rendimiento / 100 : 1;
      const cantidadBase = Number(ri.cantidad || 0);
      const necesaria = (cantidadBase * factor) / rendimientoFactor;

      return {
        id_ingrediente: ri.id_ingrediente,
        nombre: ri.ingrediente?.nombre || "Ingrediente desconocido",
        unidad: ri.ingrediente?.unidad_medida || "ud",
        necesaria,
        disponible: Number(ri.ingrediente?.stock || 0),
      };
    });
  }, [listaIngredientes, receta.cantidad_platos, racionesDeseadas]);

  const faltantes = consumos.filter((item) => item.disponible < item.necesaria);
  const canMake = listaIngredientes.length > 0 && faltantes.length === 0;

  const onChangeRaciones = (rawValue: string) => {
    if (!rawValue) {
      setRacionesDeseadas(1);
      return;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setRacionesDeseadas(1);
      return;
    }

    setRacionesDeseadas(parsed);
  };

  const handleHacerReceta = async (): Promise<void> => {
    if (!receta.id_receta) return;

    setElaborando(true);
    try {
      await recetaService.makeReceta(receta.id_receta, racionesDeseadas);
    } finally {
      setElaborando(false);
    }
  };

  return {
    racionesDeseadas,
    onChangeRaciones,
    elaborando,
    consumos,
    faltantes,
    canMake,
    handleHacerReceta,
  };
};
