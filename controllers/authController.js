const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
const registrar = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = new User({
            username,
            email,
            password: passwordHash
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar", error: error.message });
    }
};

// Login de usuario
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await User.findOne({ email });

        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        // Verificar contraseña
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        // Generar Token JWT
        const token = jwt.sign(
            { id: usuario._id }, 
            process.env.JWT_SECRET || 'palabra_secreta_123', 
            { expiresIn: '1d' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el login", error: error.message });
    }
};

module.exports = { registrar, login };