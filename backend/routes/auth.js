const router = require('express').Router();
// TODO: implementar signup/login con JWT
router.post('/signup', (req, res) => res.json({ ok: true }));
router.post('/login', (req, res) => res.json({ token: 'TODO' }));
module.exports = router;