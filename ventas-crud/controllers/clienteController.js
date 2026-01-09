const db = require('../config/database');

const obtenerClientes = async (req, res) => {
    try {
        const [clientes] = await db.query('SELECT * FROM cliente WHERE estado = 1 ORDER BY id_cliente ASC');
        res.json({
            success: true,
            data: clientes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener clientes",
            error: error.message
        });
    }
};

const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [clientes] = await db.query('SELECT * FROM cliente WHERE id_cliente = ? AND estado = 1', [id]);

        if (clientes.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Cliente no encontrado"
            });
        }

        res.json({
            success: true,
            data: clientes[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener cliente",
            error: error.message
        });
    }
};

const crearCliente = async (req, res) => {
    try {
        const { documento, nombres, apellidos } = req.body;

        if (!documento || !nombres || !apellidos) {
            return res.status(400).json({
                success: false,
                mensaje: "Documento, nombres y apellidos son requeridos"
            });
        }

        const [existing] = await db.query('SELECT id_cliente FROM cliente WHERE documento = ? AND estado = 1', [documento]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: "El documento ya está registrado"
            });
        }

        await db.query('INSERT INTO cliente (documento, nombres, apellidos, estado) VALUES (?, ?, ?, 1)', [documento, nombres, apellidos]);

        res.status(201).json({
            success: true,
            mensaje: "Cliente registrado exitosamente"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al registrar cliente",
            error: error.message
        });
    }
};

const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { documento, nombres, apellidos } = req.body;

        if (!documento || !nombres || !apellidos) {
            return res.status(400).json({
                success: false,
                mensaje: "Documento, nombres y apellidos son requeridos"
            });
        }

        // Verificar DNI duplicado en otro cliente
        const [existing] = await db.query('SELECT id_cliente FROM cliente WHERE documento = ? AND id_cliente != ? AND estado = 1', [documento, id]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: "El documento ya está registrado por otro cliente"
            });
        }

        await db.query('UPDATE cliente SET documento = ?, nombres = ?, apellidos = ? WHERE id_cliente = ?',
            [documento, nombres, apellidos, id]);

        res.json({
            success: true,
            mensaje: "Cliente actualizado exitosamente"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar cliente",
            error: error.message
        });
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        // Borrado lógico
        await db.query('UPDATE cliente SET estado = 0 WHERE id_cliente = ?', [id]);

        res.json({
            success: true,
            mensaje: "Cliente eliminado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar cliente",
            error: error.message
        });
    }
};

const buscarCliente = async (req, res) => {
    try {
        const { termino } = req.params;
        const [clientes] = await db.query(`
            SELECT * FROM cliente 
            WHERE (documento LIKE ? OR nombres LIKE ? OR apellidos LIKE ?) AND estado = 1
        `, [`%${termino}%`, `%${termino}%`, `%${termino}%`]);

        res.json({
            success: true,
            data: clientes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al buscar cliente",
            error: error.message
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    buscarCliente
};
