import { useState } from "react";

export const useRecepcionModal = (pedido: any) => {
  // Guardamos las líneas originales para tener los datos de referencia (peso pedido, etc)
  const [lineas, setLineas] = useState(pedido.lineas.map((l: any) => ({
    ...l,
    pesoRecibido: l.pesoPedido, // Carga inicial desde la API
    fechaCaducidad: "",
    observaciones: ""
  })));

  const [busqueda, setBusqueda] = useState("");
  const [lineaEnFoco, setLineaEnFoco] = useState<any | null>(null);

  // Función para buscar por nombre o código de barras
  const buscarProducto = (termino: string) => {
    setBusqueda(termino);
    const encontrado = lineas.find(l => 
      l.codigoBarras === termino || 
      l.nombre.toLowerCase().includes(termino.toLowerCase())
    );
    if (encontrado) setLineaEnFoco(encontrado);
  };

  const actualizarValor = (id: number, campo: string, valor: any) => {
    setLineas(prev => prev.map(l => l.id === id ? { ...l, [campo]: valor } : l));
    // También actualizamos la línea en foco para que se vea el cambio en el input
    if (lineaEnFoco?.id === id) {
      setLineaEnFoco((prev: any) => ({ ...prev, [campo]: valor }));
    }
  };

  return { lineas, lineaEnFoco, busqueda, buscarProducto, actualizarValor };
};