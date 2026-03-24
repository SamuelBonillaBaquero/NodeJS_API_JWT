const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    assetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Asset', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['BUY', 'SELL'], 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: [0.00000001, 'La cantidad debe ser mayor a 0'] 
    },
    priceUsdAtExecution: { 
        type: Number, 
        required: true 
    },
    executedAt: { 
        type: Date, 
        default: Date.now 
    },
    notes: { type: String }
});

module.exports = mongoose.model('Transaction', transactionSchema);