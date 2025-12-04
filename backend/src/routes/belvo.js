// backend/src/routes/belvo.js
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Si no viene en .env, usamos SANDBOX por defecto
const BELVO_BASE_URL =
  process.env.BELVO_BASE_URL || 'https://sandbox.belvo.com';

const BELVO_SECRET_ID = process.env.BELVO_SECRET_ID;
const BELVO_SECRET_PASSWORD = process.env.BELVO_SECRET_PASSWORD;

if (!BELVO_SECRET_ID || !BELVO_SECRET_PASSWORD) {
  console.warn(
    '⚠️ Falta BELVO_SECRET_ID o BELVO_SECRET_PASSWORD en el .env (Belvo no funcionará).'
  );
}

console.log('🔗 Belvo apuntando a:', BELVO_BASE_URL);

/**
 * Handler reutilizable para crear el token del widget.
 */
async function createWidgetToken(req, res) {
  try {
    if (!BELVO_SECRET_ID || !BELVO_SECRET_PASSWORD) {
      return res.status(500).json({
        message:
          'Belvo no está configurado. Revisa BELVO_SECRET_ID y BELVO_SECRET_PASSWORD en el .env',
      });
    }

    const { userId } = req.body || {};
    const externalId = userId ? `user-${userId}` : 'demo-user';

    const response = await axios.post(
      `${BELVO_BASE_URL}/api/token/`,
      {
        id: BELVO_SECRET_ID,
        password: BELVO_SECRET_PASSWORD,
        external_id: externalId,
        // Scopes mínimos para banca. Ajusta según lo que necesites.
        scopes:
          'read_institutions,write_links,read_accounts,read_transactions,read_owners,read_balances',
        fetch_historical: true,
        fetch_resources: ['ACCOUNTS', 'OWNERS', 'TRANSACTIONS'],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    // Belvo responde algo tipo { access: '...', refresh: '...' }
    return res.json({
      access: response.data.access,
      refresh: response.data.refresh,
    });
  } catch (err) {
    console.error(
      'Error obteniendo widget token de Belvo:',
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: 'No pudimos generar el token de Belvo',
      error: err.response?.data || err.message,
    });
  }
}

/**
 * POST /api/belvo/widget-token
 * POST /api/belvo/link-token  (alias – para que tus pruebas anteriores sigan funcionando)
 */
router.post('/widget-token', createWidgetToken);
router.post('/link-token', createWidgetToken);

/**
 * GET /api/belvo/accounts?linkId=XXXX
 */
router.get('/accounts', async (req, res) => {
  try {
    const { linkId } = req.query;

    if (!linkId) {
      return res
        .status(400)
        .json({ message: 'Falta el parámetro linkId' });
    }

    const response = await axios.get(
      `${BELVO_BASE_URL}/api/accounts/`,
      {
        params: { link: linkId },
        auth: {
          username: BELVO_SECRET_ID,
          password: BELVO_SECRET_PASSWORD,
        },
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return res.json({ accounts: response.data });
  } catch (err) {
    console.error(
      'Error obteniendo cuentas de Belvo:',
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: 'No pudimos obtener las cuentas desde Belvo',
      error: err.response?.data || err.message,
    });
  }
});

/**
 * GET /api/belvo/transactions?linkId=XXXX&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
 */
router.get('/transactions', async (req, res) => {
  try {
    const { linkId, date_from, date_to } = req.query;

    if (!linkId) {
      return res
        .status(400)
        .json({ message: 'Falta el parámetro linkId' });
    }

    const params = { link: linkId };
    if (date_from) params.date_from = date_from;
    if (date_to) params.date_to = date_to;

    const response = await axios.get(
      `${BELVO_BASE_URL}/api/transactions/`,
      {
        params,
        auth: {
          username: BELVO_SECRET_ID,
          password: BELVO_SECRET_PASSWORD,
        },
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return res.json({ transactions: response.data });
  } catch (err) {
    console.error(
      'Error obteniendo transacciones de Belvo:',
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: 'No pudimos obtener las transacciones desde Belvo',
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
