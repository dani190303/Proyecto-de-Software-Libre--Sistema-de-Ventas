const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.obtenerClientes);
router.post('/', clienteController.crearCliente);
router.get('/:id', clienteController.obtenerClientePorId);
router.put('/:id', clienteController.actualizarCliente);
router.delete('/:id', clienteController.eliminarCliente);
router.get('/buscar/:termino', clienteController.buscarCliente);

module.exports = router;
