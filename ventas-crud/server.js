require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const usuariosRoutes = require('./routes/usuarioRoutes'); 
const app = express(); 
 
const PORT = process.env.PORT || 3000; 
 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use('/api/usuarios',usuariosRoutes); 
 
app.get('/',(req,res)=>{ 
    res.json({ 
        mensaje : 'API de Ventas - CRUD de Usuarios' 
    }); 
}); 
app.listen(PORT,()=>{ 
    console.log(`servidor corriendo en el puerto ${PORT}`); 
}) 