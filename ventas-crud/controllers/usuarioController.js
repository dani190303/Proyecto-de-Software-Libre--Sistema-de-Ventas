const db = require('../config/database'); 
const obtenerUsuarios = async (req,res)=>{ 
    try{ 
 
        const[usuarios] = await db.query('SELECT * from usuario') ;
        res.json({ 
            succes:true, 
            count: usuarios.length, 
            data: usuarios 
        }) 
 
    }catch(error){ 
         
        res.json({ 
            succes:false, 
            mensaje:'Error al obtener usuarios', 
            error: error.mensaje 
        }) 
    } 
} 
module.exports = { 
    obtenerUsuarios 
}