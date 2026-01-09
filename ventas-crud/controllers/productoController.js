const db = require('../config/database');

const obtenerProductos = async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM producto p 
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.estado = 1
            ORDER BY p.id_producto ASC
        `);
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los productos",
            error: error.message
        });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [producto] = await db.query('SELECT * FROM producto WHERE id_producto = ? AND estado = 1', [id]);

        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }
        res.json({
            success: true,
            data: producto[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el producto",
            error: error.message
        });
    }
};

const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, estado, id_categoria } = req.body;

        if (!nombre || !precio || !stock || !id_categoria) {
            return res.status(400).json({
                success: false,
                mensaje: "Nombre, precio, stock e id_categoria son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO producto (nombre, descripcion, precio, stock, estado, id_categoria) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, estado || 1, id_categoria]
        );

        res.status(201).json({
            success: true,
            mensaje: "Producto creado exitosamente",
            data: {
                id_producto: resultado.insertId,
                nombre,
                descripcion,
                precio,
                stock,
                estado: estado || 1,
                id_categoria
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el producto",
            error: error.message
        });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, estado, id_categoria } = req.body;

        const [productoExistente] = await db.query('SELECT * FROM producto WHERE id_producto = ? AND estado = 1', [id]);
        if (productoExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }

        await db.query(
            'UPDATE producto SET nombre=?, descripcion=?, precio=?, stock=?, estado=?, id_categoria=? WHERE id_producto=?',
            [nombre, descripcion, precio, stock, estado, id_categoria, id]
        );

        res.json({
            success: true,
            mensaje: "Producto actualizado exitosamente",
            data: {
                id_producto: id,
                nombre,
                descripcion,
                precio,
                stock,
                estado,
                id_categoria
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el producto",
            error: error.message
        });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [productoExistente] = await db.query('SELECT * FROM producto WHERE id_producto = ? AND estado = 1', [id]);
        if (productoExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Producto no encontrado"
            });
        }

        // BORRADO LÓGICO
        await db.query('UPDATE producto SET estado = 0 WHERE id_producto = ?', [id]);

        res.json({
            success: true,
            mensaje: "Producto eliminado exitosamente (Lógico)",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el producto",
            error: error.message
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
