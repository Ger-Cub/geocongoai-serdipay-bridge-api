const geoCongoService = require('../services/geocongo.service');

exports.handleWebhook = async (req, res) => {
    const serdipayData = req.body;
    console.log('Webhook reçu de SerdiPay:', serdipayData);

    try {
        await geoCongoService.relayWebhook(serdipayData);
        console.log('Webhook relayed successfully to GeoCongo');
        res.status(200).send('OK');
    } catch (error) {
        console.error('Erreur lors du relai du callback:', error.response?.data || error.message);
        res.status(500).send('Error relaying webhook');
    }
};
