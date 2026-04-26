const callbackService = require('../services/callback.service');

exports.handleWebhook = async (req, res) => {
    const serdipayData = req.body;
    console.log('Webhook reçu de SerdiPay:', serdipayData);

    try {
        // Vérifier que le callback_url est fourni dans les données du webhook
        if (!serdipayData.callback_url) {
            console.warn('No callback_url provided in webhook data');
            return res.status(400).json({ error: 'callback_url is required in webhook data' });
        }

        // Envoyer le callback à l'application cliente
        await callbackService.sendCallback(serdipayData.callback_url, serdipayData);
        console.log('Webhook relayed successfully to client:', serdipayData.callback_url);
        res.status(200).json({ status: 'OK', message: 'Webhook relayed successfully' });
    } catch (error) {
        console.error('Erreur lors du relai du callback:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Error relaying webhook',
            details: error.message 
        });
    }
};
