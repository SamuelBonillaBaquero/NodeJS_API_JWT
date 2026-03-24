const Transaction = require('../models/Transaction');
const Asset = require('../models/Asset');
const coinCapService = require('../services/coinCapService');
const mongoose = require('mongoose');

// 1. POST - Crear transacción
const crearTransaccion = async (req, res) => {
    try {
        const { assetId, type, quantity, notes } = req.body;
        const assetEncontrado = await Asset.findById(assetId);
        if (!assetEncontrado) return res.status(404).json({ mensaje: "Asset no encontrado" });

        let precioEjecucion;
        try {
            precioEjecucion = await coinCapService.obtenerPrecioAsset(assetEncontrado.coincapId);
        } catch (error) {
            if (assetEncontrado.lastPriceUsd) {
                precioEjecucion = assetEncontrado.lastPriceUsd;
            } else {
                return res.status(503).json({ mensaje: "Servicio de precios no disponible" });
            }
        }

        const nuevaTransaccion = new Transaction({
            userId: req.user,
            assetId,
            type,
            quantity,
            priceUsdAtExecution: precioEjecucion,
            notes,
            executedAt: new Date()
        });

        await nuevaTransaccion.save();
        res.status(201).json(nuevaTransaccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. GET - Listar (con paginación del Bonus)
const obtenerTransacciones = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const transacciones = await Transaction.find({ userId: req.user })
            .populate('assetId', 'name symbol') // Relación requerida
            .sort({ executedAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(transacciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. GET/:id - Una sola transacción
const obtenerTransaccionPorId = async (req, res) => {
    try {
        const transaccion = await Transaction.findOne({ _id: req.params.id, userId: req.user })
            .populate('assetId', 'name symbol');

        if (!transaccion) return res.status(404).json({ mensaje: "Transacción no encontrada" });
        res.status(200).json(transaccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. PATCH - Actualizar (Solo Notes y ExecutedAt)
const actualizarTransaccion = async (req, res) => {
    try {
        const { notes, executedAt } = req.body;
        
        // Buscamos y actualizamos solo los campos permitidos
        const transaccion = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            { notes, executedAt },
            { new: true, runValidators: true }
        );

        if (!transaccion) return res.status(404).json({ mensaje: "Transacción no encontrada" });
        res.status(200).json(transaccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. DELETE - Borrar
const borrarTransaccion = async (req, res) => {
    try {
        const transaccion = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!transaccion) return res.status(404).json({ mensaje: "No encontrada" });
        res.status(200).json({ mensaje: "Transacción eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerPortfolio = async (req, res) => {
    try {
        const portfolio = await Transaction.aggregate([
            // 1. Filtrar solo las transacciones del usuario logueado
            { $match: { userId: new mongoose.Types.ObjectId(req.user) } },

            // 2. Agrupar por Asset
            {
                $group: {
                    _id: "$assetId",
                    netQuantity: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "BUY"] }, "$quantity", { $multiply: ["$quantity", -1] }]
                        }
                    }
                }
            },

            // 3. Traer la información del Asset (nombre, símbolo, precio actual)
            {
                $lookup: {
                    from: "assets",
                    localField: "_id",
                    foreignField: "_id",
                    as: "assetInfo"
                }
            },
            { $unwind: "$assetInfo" }
        ]);

        // 4. Formatear la respuesta final con los cálculos que pide el PDF
        const resultado = portfolio.map(item => {
            const currentPrice = item.assetInfo.lastPriceUsd || 0;
            return {
                asset: {
                    id: item._id,
                    symbol: item.assetInfo.symbol,
                    name: item.assetInfo.name
                },
                netQuantity: item.netQuantity,
                currentPriceUsd: currentPrice,
                currentValueUsd: item.netQuantity * currentPrice
            };
        });

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al calcular portfolio", error: error.message });
    }
};

module.exports = {
    crearTransaccion,
    obtenerTransacciones,
    obtenerTransaccionPorId,
    actualizarTransaccion,
    borrarTransaccion,
    obtenerPortfolio 
};