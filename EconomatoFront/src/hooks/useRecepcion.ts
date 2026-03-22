import { useState } from "react";
import { confirmarPedidoService } from "../services/recepcionService";
import type { LineaUI } from "../models/Recepcion";

export const useConfirmarPedido = (idPedido: number, lineasIniciales: any[]) => {
  // 1. Estado para las líneas de la tabla
  const [lineas, setLineas] = useState<LineaUI[]>(
    lineasIniciales.map(l => ({
      productoId: l.id,
      nombre: l.nombre,
      cantidadFaltante: l.pendiente,
      cantidadRecibida: l.pendiente 
    }))
  );

  // 2. Estados de control de la interfaz
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // 3. Función para actualizar una línea específica (cuando el usuario teclea)
  const actualizarCantidad = (productoId: number, valor: string) => {
    const num = parseFloat(valor) || 0;
    
    setLineas(prev => prev.map(linea => {
      if (linea.productoId === productoId) {
        // Validación: No dejamos recibir más de lo que falta
        const validado = Math.max(0, Math.min(num, linea.cantidadFaltante));
        return { ...linea, cantidadRecibida: validado };
      }
      return linea;
    }));
  };

  // 4. Función que llama al servicio
  const ejecutarConfirmacion = async () => {
    try {
      setEnviando(true);
      setError(null);
      
      await confirmarPedidoService(idPedido, lineas);
      
      return { success: true }; // Avisamos al componente que todo salió bien
    } catch (err) {
      setError("No se pudo confirmar el pedido. Revisa la conexión.");
      return { success: false };
    } finally {
      setEnviando(false);
    }
  };

  return {
    lineas,
    actualizarCantidad,
    ejecutarConfirmacion,
    enviando,
    error
  };
};