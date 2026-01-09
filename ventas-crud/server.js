require('dotenv').config();
const express = require('express');
const cors = require('cors');


const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/clientes', clienteRoutes);


app.get('/', (req, res) => {
    res.json({
        mensaje: "API PROYECTO DSSL - PUNTO DE VENTA"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el http://localhost:${PORT}`)
})