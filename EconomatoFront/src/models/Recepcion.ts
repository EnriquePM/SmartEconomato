//El back espera recibir LineaPedidoDTO
export interface LineaPedidoDTO {
  lineasRecibidas: {
    productoId: number;
    cantidad: number;
  }[];
}

// Para manejar la interfaz
export interface LineaUI {
  productoId: number;
  nombre: string;
  cantidadFaltante: number; // Recibido del back
  cantidadRecibida: number; // Lo que el usuario escribe en el input
}