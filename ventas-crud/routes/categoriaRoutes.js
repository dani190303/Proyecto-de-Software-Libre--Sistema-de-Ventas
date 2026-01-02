const express = require('express');
const router = express.Router();
const {
obtenerLibroPorIdCategoria
} = require('../controllers/categoriaController');

//RUTAS CRUD
router.get('/:id',obtenerLibroPorIdCategoria);
module.exports=router;