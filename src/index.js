require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

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
            console.log('SerdiPay Token fetched successfully. Token:', cachedToken ? cachedToken.substring(0, 10) + '...' : 'N/A', 'Expires at:', new Date(tokenExpiresAt).toISOString());
            return cachedToken;
        }
        throw new Error('Failed to retrieve access token from SerdiPay');
    } catch (error) {
        console.error('Error fetching SerdiPay token:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * @swagger
 * tags:
 *   name: General
 *   description: General operations
 * components:
 *   schemas:
 *     PaymentInitRequest:
 *       type: object
 *       required:
 *         - clientPhone
 *         - amount
 *         - currency
 *         - telecom
 *       properties:
 *         clientPhone:
 *           type: string
 *           description: The client's phone number (e.g., "243991102448").
 *           example: "243991102448"
 *         amount:
 *           type: number
 *           format: float
 *           description: The payment amount.
 *           example: 1.00
 *         currency:
 *           type: string
 *           description: The currency (e.g., "USD", "CDF").
 *           example: "USD"
 *         telecom:
 *           type: string
 *           description: The telecom operator (e.g., "AM" for Airtel Money).
 *           example: "AM"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message.
 *           example: "Missing required fields: clientPhone, amount, currency, telecom"
 * security:
 *   - ApiKeyAuth: []
 *
 * /:
 *   get:
 *     summary: Welcome message and API status
 *     tags: [General]
 *     responses:
 *       200:
 *         description: A welcome message and API status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bienvenue sur l'API de pont GeoCongo-SerdiPay"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 status:
 *                   type: string
 *                   example: "UP"
 *                 docs:
 *                   type: string
 *                   example: "/docs"
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API de pont GeoCongo-SerdiPay',
        version: '1.0.0',
        status: 'UP',
        docs: '/docs'
    });
});

/**
 * @swagger
 * /get_token:
 *   get:
 *     summary: Retrieves a SerdiPay access token
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Successfully retrieved access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       500:
 *         description: Error retrieving token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /payement_init:
 *   post:
 *     summary: Initiates a payment through SerdiPay
 *     tags: [General]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentInitRequest'
 *     responses:
 *       200:
 *         description: Payment successfully initiated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: string
 *                   example: "SDP_TRANS_123456789"
 *                 status:
 *                   type: string
 *                   example: "PENDING"
 *                 message:
 *                   type: string
 *                   example: "Payment initiated successfully."
 *       400:
 *         description: Missing required fields or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

        console.log('Payment initiated with SerdiPay. Response status:', response.status, 'Data:', response.data);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Payment init error:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('  Status:', error.response.status);
            console.error('  Headers:', error.response.headers);
            console.error('  Data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('  Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('  Message:', error.message);
        }
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
    }
});

/**
 * @swagger
 * /webhook:
 *   post:
 *     summary: Receives SerdiPay webhooks and relays them to GeoCongo
 *     tags: [General]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: SerdiPay webhook payload.
 *             example:
 *               transactionId: "SDP_TRANS_123456789"
 *               status: "COMPLETED"
 *               amount: 1.00
 *               currency: "USD"
 *               clientPhone: "243991102448"
 *     responses:
 *       200:
 *         description: Webhook successfully received and relayed.
 *       500:
 *         description: Error relaying webhook.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API is up and running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "UP"
 */
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.listen(PORT, () => {
    console.log(`Bridge API GeoCongo-SerdiPay démarrée sur le port ${PORT}`);
});
