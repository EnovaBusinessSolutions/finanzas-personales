require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Conexión a Mongo y arranque del servidor
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
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
