const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const webhookController = require('../controllers/webhook.controller');

const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message and API status
 *     tags: [General]
 *     responses:
 *       200:
 *         description: A welcome message and API status.
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API de pont GeoCongo-SerdiPay',
        version: '1.0.0',
        status: 'UP',
        docs: '/docs'
    });
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
 */
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

/**
 * @swagger
 * /get_token:
 *   get:
 *     summary: Retrieves a SerdiPay access token
 *     tags: [General]
 *     security:
 *       - ApiKeyAuth: []
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Error retrieving token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/get_token', authMiddleware.verifyApiKey, paymentController.getToken);

/**
 * @swagger
 * /payment_init:
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
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/payment_init', authMiddleware.verifyApiKey, paymentController.initiatePayment);

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
router.post('/webhook', webhookController.handleWebhook);



module.exports = router;
