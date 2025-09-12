import express from 'express'
import { 
    getAllButterflies,   
    getOneButterfly,      
    createButterfly, 
    deleteButterfly, 
    updateButterfly       
} from "../controllers/ButterflyController.js"

import {
    validateOneButterfly, 
    validateAllButterflies,
    validateCreateButterfly,
    validarUpdateButterfly,
    validateDeleteButterfly
} from "../validations/ButterflyValidations.js"

const butterflyRoutes = express.Router()

// GET - Obtener todas las mariposas
// ✅ CORRECTO - validación primero, controlador después
butterflyRoutes.get('/', validateAllButterflies, getAllButterflies)

// GET - Obtener una mariposa por ID
// ✅ CORRECTO - validación primero, controlador después
butterflyRoutes.get('/:id', validateOneButterfly, getOneButterfly)

// POST - Crear una nueva mariposa
// ✅ CORRECTO - validación primero, controlador después
butterflyRoutes.post('/', validateCreateButterfly, createButterfly)

// PUT - Actualizar una mariposa por ID
// ✅ CORRECTO - validación primero, controlador después
butterflyRoutes.put('/:id', validarUpdateButterfly, updateButterfly)

// DELETE - Eliminar una mariposa por ID
// ✅ CORRECTO - validación primero, controlador después
butterflyRoutes.delete('/:id', validateDeleteButterfly, deleteButterfly)

export default butterflyRoutes