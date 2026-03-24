const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

// --- SEGURIDAD ---
// Todas las rutas de este archivo pasan por el guardián (Token)
router.use(protect);

// --- RUTAS DE CONSULTA GENERAL ---

// 1. Portfolio (Resumen agregado de BUY - SELL)
// IMPORTANTE: Debe ir antes que /:id para evitar errores de "Cast to ObjectId"
router.get('/portfolio', transactionController.obtenerPortfolio);

// 2. Listado de transacciones (con paginación ?page=1&limit=10)
router.get('/', transactionController.obtenerTransacciones);


// --- RUTAS DE OPERACIONES ---

// 3. Crear una nueva transacción (BUY o SELL)
router.post('/', transactionController.crearTransaccion);

// 4. Obtener una transacción específica por su ID
router.get('/:id', transactionController.obtenerTransaccionPorId);

// 5. Actualizar (solo notes y executedAt según el PDF)
router.patch('/:id', transactionController.actualizarTransaccion);

// 6. Borrar una transacción
router.delete('/:id', transactionController.borrarTransaccion);

module.exports = router;