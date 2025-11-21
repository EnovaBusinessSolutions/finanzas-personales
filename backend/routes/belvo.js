const router = require('express').Router();
// TODO: implementar llamada para iniciar Belvo Link o generar token/config
router.post('/link/token', async (req, res) => {
// Aquí devolverías config/URL para Belvo Link
return res.json({ linkInitUrlOrToken: 'TODO' });
});
module.exports = router;