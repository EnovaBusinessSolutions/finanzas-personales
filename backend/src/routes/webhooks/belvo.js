// backend/src/routes/webhooks/belvo.js
const express = require('express');

const router = express.Router();

/**
 * GET /webhooks/belvo/ping
 *
 * Ruta de prueba rápida para verificar que el webhook está montado.
 * Útil mientras desarrollas: abre http://localhost:4000/webhooks/belvo/ping
 */
router.get('/ping', (req, res) => {
  return res.json({ ok: true, source: 'belvo-webhook' });
});

/**
 * POST /webhooks/belvo
 *
 * Endpoint para recibir eventos de Belvo (historical_update, etc.).
 * Como en server.js lo montamos con:
 *   app.use('/webhooks/belvo', belvoWebhook);
 *
 * La URL final es:
 *   POST http://localhost:4000/webhooks/belvo
 *
 * Más adelante aquí vas a:
 *  - leer event.webhook_type, webhook_code, link_id
 *  - llamar a /api/belvo/transactions o /api/belvo/accounts
 *  - guardar la info en Mongo para el usuario correcto
 */
router.post('/', async (req, res) => {
  try {
    const event = req.body || {};
    console.log(
      '📩 Webhook Belvo recibido:',
      JSON.stringify(event, null, 2)
    );

    // TODO futuro:
    // 1. Buscar qué usuario tiene ese link_id (cuando tengamos el modelo BelvoLink)
    // 2. Según webhook_type (TRANSACTIONS, ACCOUNTS, etc.), ir por los datos a Belvo
    // 3. Guardar en Mongo y disparar notificaciones si aplica

    // Respondemos 200 para que Belvo sepa que lo recibimos
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error procesando webhook de Belvo:', err);
    return res.sendStatus(500);
  }
});

module.exports = router;
