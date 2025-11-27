// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/auth'); // 👈 ruta al router de auth

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas públicas de prueba
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// 👇 IMPORTANTE: aquí montamos las rutas de auth
app.use('/api/auth', authRoutes);
// Eso significa que dentro de auth.js debes tener router.post('/login', ...)
// y router.post('/register', ...)

// Conexión a Mongo y arranque del servidor
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 API escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB', err);
    process.exit(1);
  });
