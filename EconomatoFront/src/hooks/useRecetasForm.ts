import { useEffect, useMemo, useState } from "react";
import type { Receta } from "../models/Receta";
import { recetaService } from "../services/recetaService";

interface IngredienteDB {
  id_ingrediente: number;
  nombre: string;
  unidad_medida: string;
}

interface IngredienteSeleccionado {
  id_ingrediente: number;
  nombre: string;
  cantidad: string;
  unidad_medida: string;
  rendimiento: string;
}

interface UseRecetaFormOptions {
  onSuccess: () => void;
  recetaInicial?: Receta | null;
}

const sanitizeNonNegative = (value: string): string => {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return "0";
  return value;
};

export const useRecetaForm = ({ onSuccess, recetaInicial }: UseRecetaFormOptions) => {
  const modoEdicion = Boolean(recetaInicial?.id_receta);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [raciones, setRaciones] = useState<string>("1");
  const [ingredientes, setIngredientes] = useState<IngredienteSeleccionado[]>([]);

  const [ingredientesDB, setIngredientesDB] = useState<IngredienteDB[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const data = await recetaService.getIngredientesDisponibles();
        setIngredientesDB(data);
      } catch (error) {
        console.error("Error al cargar ingredientes:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchIngredientes();
  }, []);

  useEffect(() => {
    if (!recetaInicial) return;

    setNombre(recetaInicial.nombre || "");
    setDescripcion(recetaInicial.descripcion || "");
    setRaciones(String(recetaInicial.cantidad_platos || 1));

    const iniciales = (recetaInicial.receta_ingrediente || []).map((ri) => ({
      id_ingrediente: ri.id_ingrediente,
      nombre: ri.ingrediente?.nombre || "Ingrediente",
      cantidad: String(ri.cantidad ?? ""),
      unidad_medida: ri.ingrediente?.unidad_medida || "ud",
      rendimiento: String(ri.rendimiento ?? 100)
    }));

    setIngredientes(iniciales);
  }, [recetaInicial]);

  const ingredientesFiltrados = useMemo(
    () => ingredientesDB.filter((ing) => ing.nombre.toLowerCase().includes(busqueda.toLowerCase())),
    [ingredientesDB, busqueda]
  );

  const agregarIngrediente = (ingDB: IngredienteDB) => {
    if (ingredientes.find((i) => i.id_ingrediente === ingDB.id_ingrediente)) return;

    setIngredientes((prev) => [
      ...prev,
      {
        id_ingrediente: ingDB.id_ingrediente,
        nombre: ingDB.nombre,
        cantidad: "",
        unidad_medida: ingDB.unidad_medida || "ud",
        rendimiento: "100"
      }
    ]);
    setBusqueda("");
  };

  const actualizarIngrediente = (id: number, campo: "cantidad" | "rendimiento", valor: string) => {
    const sanitized = sanitizeNonNegative(valor);
    setIngredientes((prev) =>
      prev.map((ing) => (ing.id_ingrediente === id ? { ...ing, [campo]: sanitized } : ing))
    );
  };

  const eliminarIngrediente = (id: number) => {
    setIngredientes((prev) => prev.filter((ing) => ing.id_ingrediente !== id));
  };

  const handleRacionesChange = (valor: string) => {
    if (valor === "") {
      setRaciones("");
      return;
    }
    const parsed = Number(valor);
    if (!Number.isFinite(parsed) || parsed < 1) {
      setRaciones("1");
      return;
    }
    setRaciones(valor);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      alert("La receta debe tener nombre.");
      return;
    }

    if (ingredientes.length === 0) {
      alert("Añade al menos un ingrediente.");
      return;
    }

    const cantidadPlatos = Number(raciones || 1);
    if (!Number.isInteger(cantidadPlatos) || cantidadPlatos <= 0) {
      alert("Las raciones deben ser un entero mayor que 0.");
      return;
    }

    const ingredientesPayload = ingredientes.map((ing) => ({
      id_ingrediente: ing.id_ingrediente,
      cantidad: Number(ing.cantidad),
      rendimiento: ing.rendimiento ? Number(ing.rendimiento) : 100
    }));

    const hasInvalid = ingredientesPayload.some(
      (ing) => !Number.isFinite(ing.cantidad) || ing.cantidad <= 0 || !Number.isFinite(ing.rendimiento) || ing.rendimiento <= 0
    );

    if (hasInvalid) {
      alert("Todas las cantidades y rendimientos deben ser mayores que 0.");
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      descripcion,
      cantidad_platos: cantidadPlatos,
      ingredientes: ingredientesPayload
    };

    try {
      setGuardando(true);
      if (modoEdicion && recetaInicial?.id_receta) {
        await recetaService.update(recetaInicial.id_receta, payload);
      } else {
        await recetaService.create(payload);
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error guardando receta:", error);
      alert(error?.message || "Hubo un error al guardar la receta en la base de datos.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    form: { nombre, setNombre, descripcion, setDescripcion, raciones, setRaciones: handleRacionesChange },
    lista: { ingredientes, agregarIngrediente, actualizarIngrediente, eliminarIngrediente },
    buscador: { busqueda, setBusqueda, sugerencias: ingredientesFiltrados, cargando },
    acciones: {
      handleGuardar,
      guardando,
      textoBoton: modoEdicion ? "GUARDAR CAMBIOS" : "CREAR RECETA",
      titulo: modoEdicion ? "Editar Elaboracion" : "Nueva Elaboracion"
    }
  };
};