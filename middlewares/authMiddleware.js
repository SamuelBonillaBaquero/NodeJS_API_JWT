const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Comprobamos si viene el token en los headers (Authorization: Bearer XXXXX)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Quitamos la palabra "Bearer " y nos quedamos solo con el código
            token = req.headers.authorization.split(' ')[1];

            // Verificamos el token con tu clave secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'palabra_secreta_123');

            // Guardamos el ID del usuario en la petición para que el controlador lo use
            req.user = decoded.id; 
            
            next(); // ¡Todo ok! Seguimos adelante
        } catch (error) {
            console.error("Error con el token:", error.message);
            res.status(401).json({ mensaje: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        res.status(401).json({ mensaje: 'No hay token, permiso denegado' });
    }
};

module.exports = { protect };