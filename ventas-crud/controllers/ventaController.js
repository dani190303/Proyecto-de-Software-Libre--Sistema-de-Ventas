const db = require('../config/database');

const obtenerVentas = async (req, res) => {
    try {
        const [ventas] = await db.query(`
            SELECT v.*, u.username, u.nombres as usuario_nombres, u.apellidos as usuario_apellidos, 
                   c.nombres as cliente_nombres, c.apellidos as cliente_apellidos, c.documento 
            FROM venta v 
            JOIN usuario u ON v.id_usuario = u.id_usuario 
            LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
            ORDER BY v.fecha DESC
        `);
        res.json({
            success: true,
            count: ventas.length,
            data: ventas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las ventas",
            error: error.message
        });
    }
};

const obtenerVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [venta] = await db.query(`
            SELECT v.*, u.username, u.nombres as usuario_nombres, u.apellidos as usuario_apellidos, 
                   c.nombres as cliente_nombres, c.apellidos as cliente_apellidos, c.documento 
            FROM venta v 
            JOIN usuario u ON v.id_usuario = u.id_usuario 
            LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
            WHERE v.id_venta = ?
        `, [id]);

        if (venta.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Venta no encontrada"
            });
        }

        const [detalles] = await db.query(`
            SELECT dv.*, p.nombre as producto_nombre 
            FROM detalle_venta dv 
            JOIN producto p ON dv.id_producto = p.id_producto 
            WHERE dv.id_venta = ?
        `, [id]);

        res.json({
            success: true,
            data: {
                ...venta[0],
                detalles: detalles
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la venta",
            error: error.message
        });
    }
};

const crearVenta = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const { id_usuario, detalles, id_cliente, tipo_comprobante, tipo_cambio } = req.body;

        if (!id_usuario || !detalles || detalles.length === 0 || !tipo_cambio) {
            return res.status(400).json({
                success: false,
                mensaje: "Faltan datos requeridos (usuario, detalles, tipo_cambio)"
            });
        }

        // 1. Calcular el Total y preparar los detalles verificando precios y stock
        let totalUSD = 0;
        const detallesParaInsertar = [];

        for (const item of detalles) {
            // Obtener precio y stock actual del producto
            const [producto] = await connection.query(
                'SELECT precio, stock, nombre FROM producto WHERE id_producto = ?',
                [item.id_producto]
            );

            if (producto.length === 0) {
                throw new Error(`El producto con ID ${item.id_producto} no existe`);
            }

            const { precio, stock, nombre } = producto[0];

            if (stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto "${nombre}". Disponible: ${stock}`);
            }

            // El precio de la BD se asume en DOLARES según requerimiento ("el total( es en dolares)")
            // Aplicar descuento porcentual si existe
            const descuentoPorcentaje = item.descuento || 0;
            const precioConDescuento = precio * (1 - (descuentoPorcentaje / 100));

            const subtotal = precioConDescuento * item.cantidad;
            totalUSD += subtotal;

            detallesParaInsertar.push({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: precio, // Precio base
                descuento: descuentoPorcentaje,
                subtotal: subtotal // Subtotal real cobrado
            });
        }

        const totalPEN = totalUSD * tipo_cambio;

        // 2. Insertar Venta (Cabecera)
        const [ventaResult] = await connection.query(
            `INSERT INTO venta (id_usuario, total, total_usd, total_pen, tipo_cambio, id_cliente, tipo_comprobante) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_usuario, totalUSD, totalUSD, totalPEN, tipo_cambio, id_cliente || null, tipo_comprobante || 'BOLETA']
        );
        const id_venta = ventaResult.insertId;

        // 3. Insertar Detalles y Actualizar Stock
        for (const detalle of detallesParaInsertar) {
            // Insertar detalle con el precio histórico (el del momento de la venta)
            await connection.query(
                `INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, descuento, subtotal) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [id_venta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario, detalle.descuento, detalle.subtotal]
            );

            // Actualizar stock del producto
            await connection.query(
                'UPDATE producto SET stock = stock - ? WHERE id_producto = ?',
                [detalle.cantidad, detalle.id_producto]
            );
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            mensaje: "Venta registrada exitosamente",
            data: {
                id_venta,
                id_usuario,
                total: totalUSD,
                total_usd: totalUSD,
                total_pen: totalPEN,
                items_count: detallesParaInsertar.length
            }
        });

    } catch (error) {
        if (connection) await connection.rollback();

        // Manejo de errores personalizados (stock, producto no encontrado) vs errores de BD
        const statusCode = error.message.includes('Stock insuficiente') || error.message.includes('no existe') ? 400 : 500;

        res.status(statusCode).json({
            success: false,
            mensaje: "Error al registrar la venta",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

const eliminarVenta = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;

        const [venta] = await db.query('SELECT * FROM venta WHERE id_venta = ?', [id]);
        if (venta.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Venta no encontrada"
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Eliminar detalles
        await connection.query('DELETE FROM detalle_venta WHERE id_venta = ?', [id]);

        // Eliminar venta
        await connection.query('DELETE FROM venta WHERE id_venta = ?', [id]);

        await connection.commit();

        res.json({
            success: true,
            mensaje: "Venta eliminada exitosamente"
        });

    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar la venta",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    eliminarVenta
};
