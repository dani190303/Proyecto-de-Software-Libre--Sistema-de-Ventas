const db = require('../config/database')

const obtenerLibroPorIdCategoria = async (req, res) => {
    try {

        const { id } = req.params;
        const [categoria] = await
            db.query('SELECT * FROM categoria WHERE idcategoria= ?', [id]);
        if (categoria.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: "categoria no encontrada"
            });
        }

        const [libros] = await db.query('select * from libros where idcategoria=?',[id]) 


        res.json({
            success: true,
            categoria:categoria[0],
            count: libros.length,
            data: libros
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            mensaje: "Error al obtener los libros",
            error: error.mensaje
        })
    }
};

module.exports = {    
    obtenerLibroPorIdCategoria
}