export type LineaPedido = {
    id: number;
    productoId: number;
    nombre: string;
    categoria: string;
    unidad: string;
    cantidad: number;
    precio: number;
    subtotal: number;
};

export type Pedido = {
    id: string | number;
    tipo: 'productos' | 'utensilios';
    proveedor: string;
    fecha: string;
    estado: string;
    total: number;
    observaciones: string;
    lineas: LineaPedido[];
};

export type ItemCatalogo = {
    id: number;
    nombre: string;
    categoria: string;
    unidad: string;
    precioUltimo: number;
};