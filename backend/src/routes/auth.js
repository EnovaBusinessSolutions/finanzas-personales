// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validaciones básicas
    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: 'Nombre, email, teléfono y contraseña son obligatorios' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'Este correo ya está registrado, intenta con otro.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
    });

    // En este MVP todavía no confirmamos correo/teléfono
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    });
  } catch (err) {
    console.error('Error en /register', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Tu correo o contraseña no coinciden. Vuelve a intentarlo' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: 'Tu correo o contraseña no coinciden. Vuelve a intentarlo' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (err) {
    console.error('Error en /login', err);
    res.status(500).json({ message: 'Error interno' });
  }
});

module.exports = router;
