import { useState, useEffect } from "react";
import { recetaService } from "../services/recetaService";

// Definimos las interfaces locales
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

export const useRecetaForm = (onSuccess: () => void) => {
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

  const ingredientesFiltrados = ingredientesDB.filter((ing) =>
    ing.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarIngrediente = (ingDB: IngredienteDB) => {
    if (ingredientes.find(i => i.id_ingrediente === ingDB.id_ingrediente)) return;
    setIngredientes([
      ...ingredientes,
      {
        id_ingrediente: ingDB.id_ingrediente,
        nombre: ingDB.nombre,
        cantidad: "",
        unidad_medida: ingDB.unidad_medida || "ud", 
        rendimiento: "", 
      }
    ]);
    setBusqueda(""); 
  };

  const actualizarIngrediente = (id: number, campo: 'cantidad' | 'rendimiento', valor: string) => {
    setIngredientes(ingredientes.map(ing => 
      ing.id_ingrediente === id ? { ...ing, [campo]: valor } : ing
    ));
  };

  const eliminarIngrediente = (id: number) => {
    setIngredientes(ingredientes.filter(ing => ing.id_ingrediente !== id));
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || ingredientes.length === 0) {
      alert("Por favor, ponle un nombre y añade al menos un ingrediente.");
      return;
    }
    setGuardando(true);
    const nuevaReceta = {
      nombre,
      descripcion,
      cantidad_platos: Number(raciones),
      receta_ingrediente: ingredientes.map(ing => ({
        id_ingrediente: ing.id_ingrediente,
        cantidad: Number(ing.cantidad),
        rendimiento: ing.rendimiento ? Number(ing.rendimiento) : 100 
      }))
    };
    try {
      await recetaService.create(nuevaReceta);
      onSuccess(); 
    } catch (error) {
      console.error("Error guardando receta:", error);
      alert("Hubo un error al guardar la receta en la base de datos.");
    } finally {
      setGuardando(false);
    }
  };

  return {
    form: { nombre, setNombre, descripcion, setDescripcion, raciones, setRaciones },
    lista: { ingredientes, agregarIngrediente, actualizarIngrediente, eliminarIngrediente },
    buscador: { busqueda, setBusqueda, sugerencias: ingredientesFiltrados, cargando },
    acciones: { handleGuardar, guardando }
  };
};