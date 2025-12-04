// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 🔐 Rutas de autenticación
const authRoutes = require('./src/routes/auth');

// 💳 Rutas de Belvo (API para tu app)
const belvoRoutes = require('./src/routes/belvo');

// 📩 Webhook de Belvo (para que Belvo nos llame)
const belvoWebhook = require('./src/routes/webhooks/belvo');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parsea JSON del body

// Rutas públicas de prueba
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// 👇 Auth
app.use('/api/auth', authRoutes);
// Dentro de auth.js tienes router.post('/login', ...) y router.post('/register', ...)

// 👇 Belvo API (tu app móvil hablará con esto)
app.use('/api/belvo', belvoRoutes);

// 👇 Webhook Belvo (URL que configurarás en el panel de Belvo)
app.use('/webhooks/belvo', belvoWebhook);

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
