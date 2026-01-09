const db = require('../config/database');

const obtenerUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT * FROM usuario WHERE estado = 1 ORDER BY id_usuario ASC');
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
        const [usuario] = await db.query('SELECT * FROM usuario WHERE id_usuario = ? AND estado = 1', [id]);

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
            'INSERT INTO usuario (nombres, apellidos, username, password, rol, estado) VALUES (?, ?, ?, ?, ?, 1)',
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
                rol,
                estado: 1
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

        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE id_usuario = ? AND estado = 1', [id]);
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
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE id_usuario = ? AND estado = 1', [id]);
        if (usuarioExistente.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }

        // BORRADO LÓGICO: Solo cambiamos estado a 0
        await db.query('UPDATE usuario SET estado = 0 WHERE id_usuario = ?', [id]);

        res.json({
            success: true,
            mensaje: "Usuario eliminado exitosamente (Lógico)",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        console.log("Intento de login:", req.body); // DEBUG
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                mensaje: "Usuario y contraseña son obligatorios"
            });
        }

        const [usuario] = await db.query('SELECT * FROM usuario WHERE username = ? AND estado = 1', [username]);
        console.log("Usuario encontrado en DB:", usuario); // DEBUG

        if (usuario.length === 0) {
            return res.status(401).json({
                success: false,
                mensaje: "Credenciales inválidas (Usuario no existe)"
            });
        }

        // Comparación simple de texto plano como solicitado
        if (password !== usuario[0].password) {
            console.log("Password incorrecto. Recibido:", password, "Esperado:", usuario[0].password); // DEBUG
            return res.status(401).json({
                success: false,
                mensaje: "Credenciales inválidas (Password incorrecto)"
            });
        }

        // Login exitoso
        console.log("Login exitoso para:", username); // DEBUG
        res.json({
            success: true,
            mensaje: "Login exitoso",
            data: {
                id_usuario: usuario[0].id_usuario,
                nombres: usuario[0].nombres,
                apellidos: usuario[0].apellidos,
                username: usuario[0].username,
                rol: usuario[0].rol
            }
        });

    } catch (error) {
        console.error("Error en login:", error); // DEBUG
        res.status(500).json({
            success: false,
            mensaje: "Error en el login",
            error: error.message
        });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    login
};
