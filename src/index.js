require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory token storage
let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Utility to get a new token from SerdiPay
 */
async function getSerdiPayToken() {
    // Check if cached token is still valid (safety margin of 60 seconds)
    if (cachedToken && tokenExpiresAt && Date.now() < (tokenExpiresAt - 60000)) {
        return cachedToken;
    }

    try {
        console.log('Fetching new token from SerdiPay...');
        const response = await axios.post('https://serdipay.com/api/public-api/v1/merchant/get-token', {
            email: process.env.SERDIPAY_MERCHANT_EMAIL,
            password: process.env.SERDIPAY_MERCHANT_PASSWORD
        });

        if (response.data && response.data.access_token) {
            cachedToken = response.data.access_token;
            // Assuming token expires in response.data.expires_in (convert to ms and add to now)
            // If expires_in is not provided, we might need a default (e.g., 1 hour)
            const expiresIn = (response.data.expires_in || 3600) * 1000;
            tokenExpiresAt = Date.now() + expiresIn;
            return cachedToken;
        }
        throw new Error('Failed to retrieve access token from SerdiPay');
    } catch (error) {
        console.error('Error fetching SerdiPay token:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * 0. GET / (Welcome)
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API de pont GeoCongo-SerdiPay',
        version: '1.0.0',
        status: 'UP'
    });
});

/**
 * 1. GET /get_token
 */
app.get('/get_token', async (req, res) => {
    try {
        const token = await getSerdiPayToken();
        res.json({ access_token: token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du token' });
    }
});

/**
 * 2. POST /payement_init
 */
app.post('/payement_init', async (req, res) => {
    const { clientPhone, amount, currency, telecom } = req.body;

    // Basic validation
    if (!clientPhone || !amount || !currency || !telecom) {
        return res.status(400).json({ error: 'Missing required fields: clientPhone, amount, currency, telecom' });
    }

    try {
        const token = await getSerdiPayToken();

        const response = await axios.post('https://serdipay.com/api/public-api/v1/merchant/payment-merchant', {
            api_id: process.env.SERDIPAY_API_ID,
            api_password: process.env.SERDIPAY_API_PASSWORD,
            merchantCode: process.env.SERDIPAY_MERCHANT_CODE,
            merchant_pin: process.env.SERDIPAY_MERCHANT_PIN,
            clientPhone,
            amount,
            currency,
            telecom
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Payment initialized:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Payment init error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
    }
});

/**
 * 3. POST /webhook
 */
app.post('/webhook', async (req, res) => {
    const serdipayData = req.body;
    console.log('Webhook reçu de SerdiPay:', serdipayData);

    try {
        // Relai vers GeoCongo AI
        await axios.post(process.env.GEOCONGO_CALLBACK_URL, serdipayData, {
            headers: { 'x-api-key': process.env.GEOCONGO_API_KEY }
        });
        console.log('Webhook relayed successfully to GeoCongo');
        res.status(200).send('OK');
    } catch (error) {
        console.error('Erreur lors du relai du callback:', error.response?.data || error.message);
        res.status(500).send('Error relaying webhook');
    }
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
    console.log(`Bridge API GeoCongo-SerdiPay démarrée sur le port ${PORT}`);
});
