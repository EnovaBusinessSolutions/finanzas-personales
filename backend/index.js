// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
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
// RUTAS EXISTENTES (BELVO / AUTH)
// =========================
app.use('/auth', require('./routes/auth'));
app.use('/belvo', require('./routes/belvo'));
app.post('/webhooks/belvo', require('./routes/webhooks/belvo'));

// =========================
// ARRANCAR SERVIDOR
// =========================
const port = process.env.PORT || 3001;
app.listen(port, () => console.log('API en puerto', port));
