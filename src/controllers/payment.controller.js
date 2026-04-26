const serdiPayService = require('../services/serdipay.service');

exports.getToken = async (req, res) => {
    try {
        const token = await serdiPayService.getToken();
        res.json({ access_token: token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du token' });
    }
};

exports.initiatePayment = async (req, res) => {
    const { clientPhone, amount, currency, telecom, callback_url } = req.body;

    if (!clientPhone || !amount || !currency || !telecom) {
        return res.status(400).json({ 
            error: 'Missing required fields: clientPhone, amount, currency, telecom' 
        });
    }

    if (!callback_url) {
        return res.status(400).json({ 
            error: 'Missing required field: callback_url (where to send payment response)' 
        });
    }

    try {
        const paymentData = { clientPhone, amount, currency, telecom, callback_url };
        const response = await serdiPayService.initiatePayment(paymentData);
        console.log('Payment initiated with SerdiPay. Response status:', response.status);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Payment init error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
    }
};
