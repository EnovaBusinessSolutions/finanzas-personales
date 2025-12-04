// backend/src/routes/webhooks/belvo.js
const express = require('express');

const router = express.Router();

/**
 * POST /webhooks/belvo
 *
 * Endpoint para recibir eventos de Belvo (historical_update, etc.).
 * Más adelante aquí vas a:
 *  - leer event.webhook_type, webhook_code, link_id
 *  - llamar a /api/belvo/transactions o /api/belvo/accounts
 *  - guardar la info en Mongo para el usuario correcto
 */
router.post('/', async (req, res) => {
  try {
    const event = req.body;
    console.log('📩 Webhook Belvo recibido:', JSON.stringify(event, null, 2));

    // TODO:
    // 1. Buscar qué usuario tiene ese link_id (cuando tengamos el modelo BelvoLink)
    // 2. Según webhook_type (TRANSACTIONS, ACCOUNTS, etc.), ir por los datos a Belvo
    // 3. Guardar en Mongo y disparar notificaciones si aplica

    return res.sendStatus(200);
  } catch (err) {
    console.error('Error procesando webhook de Belvo:', err);
    return res.sendStatus(500);
  }
});

module.exports = router;
