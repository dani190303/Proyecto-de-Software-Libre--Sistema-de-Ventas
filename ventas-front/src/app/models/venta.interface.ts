export interface DetalleVenta {
    id_producto: number;
    nombre_producto?: string; // Para mostrar en la tabla
    precio_unitario: number; // Para mostrar en la tabla (aunque el backend lo recalcula, sirve de referencia)
    cantidad: number;
    subtotal?: number; // Calculado en front para vista previa
}

export interface Venta {
    id_usuario: number;
    detalles: DetalleVenta[];
}
