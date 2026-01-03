export interface Producto {
    id_producto?: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    estado?: number;
    id_categoria: number;
    categoria_nombre?: string;
}
