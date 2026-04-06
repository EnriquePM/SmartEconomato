import { useState } from "react";

export const useRecetaModal = (onSave: (receta: any) => void) => {
  const [nombre, setNombre] = useState("");
  const [platos, setPlatos] = useState<number>(1);
  const [ingredientesElegidos, setIngredientesElegidos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [ingredienteEnFoco, setIngredienteEnFoco] = useState<any | null>(null);

  // Handlers para tus Inputs
  const handleNombreChange = (val: string) => setNombre(val);
  const handlePlatosChange = (val: string) => setPlatos(Number(val));
  const handleBusquedaChange = (val: string) => setBusqueda(val);

  const agregarIngrediente = (ing: any) => {
    const existe = ingredientesElegidos.find(i => i.id_ingrediente === ing.id_ingrediente);
    setIngredienteEnFoco(existe ? { ...existe } : {
      ...ing,
      cantidad: 0,
      rendimiento: 100
    });
  };

  const actualizarFoco = (campo: string, valor: string) => {
    setIngredienteEnFoco((prev: any) => ({
      ...prev,
      [campo]: Number(valor)
    }));
  };

  const confirmarIngrediente = () => {
    if (!ingredienteEnFoco) return;
    setIngredientesElegidos(prev => {
      const filtrados = prev.filter(i => i.id_ingrediente !== ingredienteEnFoco.id_ingrediente);
      return [...filtrados, ingredienteEnFoco];
    });
    setIngredienteEnFoco(null);
    setBusqueda("");
  };

  return {
    nombre, handleNombreChange,
    platos, handlePlatosChange,
    ingredientesElegidos,
    ingredienteEnFoco, setIngredienteEnFoco,
    busqueda, handleBusquedaChange,
    agregarIngrediente,
    actualizarFoco,
    confirmarIngrediente
  };
};