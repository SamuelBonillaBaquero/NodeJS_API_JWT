require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


// Importamos las rutas (las crearemos en el siguiente paso)
const assetRoutes = require('./routes/assetRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware para entender JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ ¡CONECTADO A MONGODB CORRECTAMENTE!');
    })
    .catch((err) => {
        console.log('❌ ERROR AL CONECTAR A MONGO:', err.message);
    });

// Ruta de prueba para saber que el servidor vive
app.get('/test', (req, res) => {
    res.json({ mensaje: "El servidor está vivo 🚀" });
});

// USAR RUTAS (Comentado hasta que las tengas creadas)
app.use('/assets', assetRoutes);
app.use('/auth', authRoutes);
 app.use('/transactions', require('./routes/transactionRoutes'));

// EL COMANDANTE: Esto mantiene el proceso encendido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});