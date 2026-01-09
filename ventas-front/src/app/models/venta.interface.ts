export interface DetalleVenta {
    id_producto: number;
    nombre_producto?: string;
    precio_unitario: number;
    cantidad: number;
    descuento?: number; // Porcentaje
    subtotal?: number;
}

export interface Venta {
    id_venta?: number;
    id_usuario: number;
    fecha?: string;

    // Totales
    total?: number; // USD
    total_usd?: number;
    total_pen?: number;
    tipo_cambio?: number;

    detalles: DetalleVenta[];
    id_cliente?: number | null;
    tipo_comprobante?: 'BOLETA' | 'FACTURA';

    // Campos para visualización
    cliente_nombres?: string;
    cliente_apellidos?: string;
    documento?: string;
    username?: string;
}
