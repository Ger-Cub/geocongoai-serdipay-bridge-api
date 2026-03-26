/**
 * @swagger
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
 *   responses:
 *     UnauthorizedError:
 *       description: API Key is missing or invalid.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */
