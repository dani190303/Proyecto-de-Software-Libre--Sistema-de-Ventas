const db = require('../config/database');

const obtenerCategorias = async (req, res) => {
    try {
        const [categorias] = await db.query('SELECT * FROM categoria ORDER BY id_categoria ASC');
        res.json({
            success: true,
            count: categorias.length,
            data: categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener las categorías",
            error: error.message
        });
    }
};

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [categoria] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id]);

        if (categoria.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Categoría no encontrada"
            });
        }
        res.json({
            success: true,
            data: categoria[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener la categoría",
            error: error.message
        });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                mensaje: "El nombre es obligatorio"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO categoria (nombre) VALUES (?)',
            [nombre]
        );

        res.status(201).json({
            success: true,
            mensaje: "Categoría creada exitosamente",
            data: {
                id_categoria: resultado.insertId,
                nombre
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al crear la categoría",
            error: error.message
        });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const [categoriaExistente] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
        if (categoriaExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Categoría no encontrada"
            });
        }

        await db.query(
            'UPDATE categoria SET nombre=? WHERE id_categoria=?',
            [nombre, id]
        );

        res.json({
            success: true,
            mensaje: "Categoría actualizada exitosamente",
            data: {
                id_categoria: id,
                nombre
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar la categoría",
            error: error.message
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const [categoriaExistente] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
        if (categoriaExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Categoría no encontrada"
            });
        }

        await db.query('DELETE FROM categoria WHERE id_categoria = ?', [id]);

        res.json({
            success: true,
            mensaje: "Categoría eliminada exitosamente",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar la categoría",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};