const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/', assetController.obtenerAssets); 
router.get('/:id', assetController.obtenerAssetPorId);
router.post('/', assetController.crearAsset);
router.patch('/:id/refresh-last-price', assetController.refrescarPrecio);

module.exports = router;