const Asset = require('../models/Asset');
const coinCapService = require('../services/coinCapService');

// 1. OBTENER TODOS LOS ASSETS (GET /assets)
exports.obtenerAssets = async (req, res) => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los assets' });
    }
};

// 2. OBTENER UN ASSET POR ID (GET /assets/:id)
exports.obtenerAssetPorId = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ mensaje: 'Asset no encontrado' });
        }
        res.json(asset);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el asset' });
    }
};

// 3. CREAR UN ASSET (POST /assets)
exports.crearAsset = async (req, res) => {
    try {
        const { symbol, name, coincapId } = req.body;

        // Validaciones mínimas
        if (!symbol || !name || !coincapId) {
            return res.status(400).json({ mensaje: 'Faltan campos: symbol, name y coincapId son obligatorios' });
        }

        const nuevoAsset = new Asset({ symbol, name, coincapId });
        await nuevoAsset.save();
        
        res.status(201).json(nuevoAsset);
    } catch (error) {
        // Error por coincapId único (error 11000 de MongoDB)
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'El coincapId ya existe en la base de datos' });
        }
        res.status(500).json({ mensaje: 'Error al crear el asset', error: error.message });
    }
};

// 4. REFRESCAR PRECIO DESDE COINCAP (PATCH /assets/:id/refresh-last-price)
exports.refrescarPrecio = async (req, res) => {
    try {
        const { id } = req.params;
        const asset = await Asset.findById(id);

        if (!asset) {
            return res.status(404).json({ mensaje: 'Asset no encontrado' });
        }

        // Llamamos al servicio externo de CoinCap
        const nuevoPrecio = await coinCapService.obtenerPrecioAsset(asset.coincapId);

        // Actualizamos campos y guardamos
        asset.lastPriceUsd = nuevoPrecio;
        asset.lastPriceAt = new Date();
        await asset.save();

        res.json({
            mensaje: 'Precio actualizado correctamente',
            asset
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al conectar con CoinCap', error: error.message });
    }
};