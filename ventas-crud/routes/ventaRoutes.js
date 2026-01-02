const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// Rutas para ventas
router.get('/', ventaController.obtenerVentas);
router.get('/:id', ventaController.obtenerVentaPorId);
router.post('/', ventaController.crearVenta);
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;
