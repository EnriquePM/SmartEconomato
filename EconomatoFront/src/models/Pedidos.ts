export interface PedidoIngrediente {
  id_pedido?: number;
  id_ingrediente: number;
  cantidad_solicitada: number; 
}

export interface PedidoMaterial {
  id_pedido?: number;
  id_material: number;
  cantidad_solicitada: number;
}

export type EstadoPedido = 'BORRADOR' | 'PENDIENTE' | 'VALIDADO' | 'CONFIRMADO' | 'RECHAZADO';

export interface Pedido {
  id_pedido?: number;           
  fecha_pedido?: string | Date; 
  id_usuario: number;           
  estado: EstadoPedido;
  proveedor: string | null;
  observaciones: string | null;
  total_estimado: number | null;
  tipo_pedido: string | null;   

 
  pedido_ingrediente?: PedidoIngrediente[];
  pedido_material?: PedidoMaterial[];
}

export interface Linea {
  id_producto: number;
  cantidad: number;
  nombre?: string;
  unidad?: string;
  precio?: number;
}