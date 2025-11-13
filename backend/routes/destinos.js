const express = require('express');
const router = express.Router();
const destinosController = require('../controllers/destinoscontroller');

// GET /api/destinos - Obtener todos los destinos
router.get('/', destinosController.getAllDestinos);

// GET /api/destinos/:id - Obtener un destino por ID
router.get('/:id', destinosController.getDestinoById);

// POST /api/destinos - Crear nuevo destino
router.post('/', destinosController.createDestino);

// PUT /api/destinos/:id - Actualizar destino
router.put('/:id', destinosController.updateDestino);

// DELETE /api/destinos/:id - Eliminar destino
router.delete('/:id', destinosController.deleteDestino);

// GET /api/destinos/categoria/:categoria - Obtener destinos por categoría
router.get('/categoria/:categoria', destinosController.getDestinosByCategoria);

module.exports = router;