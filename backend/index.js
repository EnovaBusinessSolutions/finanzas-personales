// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// =========================
// MIDDLEWARES BÁSICOS
// =========================
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// =========================
// ENDPOINT DE SALUD
// =========================
app.get('/health', (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

// =========================
// DATOS MOCK DE EJEMPLO
// =========================
const movimientosDemo = [
  {
    id: 1,
    fecha: '2025-11-01',
    descripcion: 'OXXO',
    categoria: 'Comida',
    monto: -89.5,
  },
  {
    id: 2,
    fecha: '2025-11-02',
    descripcion: 'Uber',
    categoria: 'Transporte',
    monto: -120,
  },
  {
    id: 3,
    fecha: '2025-11-05',
    descripcion: 'Nómina',
    categoria: 'Ingreso',
    monto: 12500,
  },
];

// =========================
// ENDPOINT: SOLO MOVIMIENTOS
// =========================
app.get('/movimientos-demo', (_req, res) => {
  res.json({ ok: true, data: movimientosDemo });
});

// =========================
// ENDPOINT: RESUMEN + MOVIMIENTOS
// =========================
app.get('/dashboard-demo', (_req, res) => {
  const ingresos = movimientosDemo
    .filter((m) => m.monto > 0)
    .reduce((acc, m) => acc + m.monto, 0);

  const gastos = movimientosDemo
    .filter((m) => m.monto < 0)
    .reduce((acc, m) => acc + Math.abs(m.monto), 0);

  const saldo = ingresos - gastos;

  res.json({
    ok: true,
    resumen: {
      ingresos,
      gastos,
      saldo,
    },
    movimientos: movimientosDemo,
  });
});

// =========================
// RUTAS (AUTH / BELVO / WEBHOOKS)
// =========================

// ⚠️ IMPORTANTE: ajusta la ruta del require según tu estructura real.
// Si tu archivo está en backend/src/routes/auth.js usa './src/routes/auth'
const authRoutes = require('./src/routes/auth');

app.use('/api/auth', authRoutes); // 👈 ahora SÍ coincide con /api/auth/login

// Si ya tienes estas rutas y archivos, las dejamos igual:
app.use('/belvo', require('./routes/belvo'));
app.post('/webhooks/belvo', require('./routes/webhooks/belvo'));

// =========================
// CONEXIÓN A MONGO + ARRANQUE
// =========================
const port = process.env.PORT || 4000;              // que coincida con tu app.json
const mongoUri = process.env.MONGODB_URI;           // debe estar en tu .env

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(port, () =>
      console.log(`🚀 API escuchando en http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB', err);
    process.exit(1);
  });
