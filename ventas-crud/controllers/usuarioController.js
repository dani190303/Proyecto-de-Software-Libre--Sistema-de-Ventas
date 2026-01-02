const db = require('../config/database');

const obtenerUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuario ORDER BY id_usuario DESC');
        res.json({
            success: true,
            count: usuarios.length,
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [usuario] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
        
        if (usuario.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }
        res.json({
            success: true,
            data: usuario[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al obtener el usuario",
            error: error.message
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { nombres, apellidos, username, password, rol } = req.body;
        
        if (!nombres || !apellidos || !username || !password || !rol) {
            return res.status(400).json({
                success: false,
                mensaje: "Todos los campos son obligatorios"
            });
        }

        const [resultado] = await db.query(
            'INSERT INTO usuario (nombres, apellidos, username, password, rol) VALUES (?, ?, ?, ?, ?)',
            [nombres, apellidos, username, password, rol]
        );

        res.status(201).json({
            success: true,
            mensaje: "Usuario creado exitosamente",
            data: {
                id_usuario: resultado.insertId,
                nombres,
                apellidos,
                username,
                rol
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al crear el usuario",
            error: error.message
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, username, password, rol } = req.body;
        
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
        if (usuarioExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }
        
        await db.query(
            'UPDATE usuario SET nombres=?, apellidos=?, username=?, password=?, rol=? WHERE id_usuario=?',
            [nombres, apellidos, username, password, rol, id]
        );

        res.json({
            success: true,
            mensaje: "Usuario actualizado exitosamente",
            data: {
                id_usuario: id,
                nombres,
                apellidos,
                username,
                rol
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;        
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
        if (usuarioExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }
        
        await db.query('DELETE FROM usuario WHERE id_usuario = ?', [id]);

        res.json({
            success: true,
            mensaje: "Usuario eliminado exitosamente",            
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
