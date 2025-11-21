module.exports = async (req, res) => {
const event = req.body;
console.log('Webhook Belvo:', JSON.stringify(event));
// TODO: fetch transacciones; guardar en DB; notificar al usuario
return res.sendStatus(200);
};