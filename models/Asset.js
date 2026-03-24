const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    symbol: { type: String, required: true }, // Ej: "BTC"
    name: { type: String, required: true },   // Ej: "Bitcoin"
    coincapId: { type: String, required: true, unique: true }, // ID para la API (ej: "bitcoin")
    lastPriceUsd: { type: Number },
    lastPriceAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);