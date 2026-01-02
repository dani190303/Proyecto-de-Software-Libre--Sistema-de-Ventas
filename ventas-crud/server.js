require('dotenv').config();
const express = require('express');
const cors = require('cors');


const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', usuarioRoutes);


app.get('/', (req, res) => {
    res.json({
        mensaje: "API PROYECTO DSSL - PUNTO DE VENTA"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el http://localhost:${PORT}`)
})