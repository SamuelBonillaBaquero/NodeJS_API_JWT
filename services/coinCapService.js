const axios = require('axios');

/**
 * Obtiene el precio actual en USD desde CoinGecko
 * @param {string} coincapId - El ID del asset (ej: "bitcoin")
 * @returns {Promise<number>} - El precio en USD
 */
const obtenerPrecioAsset = async (coincapId) => {
    try {
        // La URL de CoinGecko es distinta: pasamos el ID y la moneda de destino (usd)
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coincapId}&vs_currencies=usd`;
        
        console.log(`🌐 Llamando a CoinGecko para: ${coincapId}...`);
        
        const respuesta = await axios.get(url);
        
        // Estructura de respuesta de CoinGecko: { "bitcoin": { "usd": 63450.12 } }
        if (respuesta.data && respuesta.data[coincapId]) {
            const precio = respuesta.data[coincapId].usd;
            console.log(`✅ ¡PRECIO REAL! ${coincapId}: $${precio}`);
            return precio;
        } else {
            throw new Error(`No se encontró el precio para ${coincapId}`);
        }

    } catch (error) {
        console.error("--- ERROR CON COINGECKO ---");
        console.error("Mensaje:", error.message);
        
        // Si falla, lanzamos el error para que Postman lo vea
        throw new Error('Error al conectar con la API de CoinGecko');
    }
};

module.exports = { obtenerPrecioAsset };