const axios = require('axios');

class SerdiPayService {
    constructor() {
        this.cachedToken = null;
        this.tokenExpiresAt = null;
        this.baseUrl = 'https://serdipay.com/api/public-api/v1';
    }

    async getToken() {
        // Check if cached token is still valid (safety margin of 60 seconds)
        if (this.cachedToken && this.tokenExpiresAt && Date.now() < (this.tokenExpiresAt - 60000)) {
            return this.cachedToken;
        }

        try {
            console.log('Fetching new token from SerdiPay...');
            const response = await axios.post(`${this.baseUrl}/merchant/get-token`, {
                email: process.env.SERDIPAY_MERCHANT_EMAIL,
                password: process.env.SERDIPAY_MERCHANT_PASSWORD
            });

            if (response.data && response.data.access_token) {
                this.cachedToken = response.data.access_token;
                const expiresIn = (response.data.expires_in || 3600) * 1000;
                this.tokenExpiresAt = Date.now() + expiresIn;
                console.log('SerdiPay Token fetched successfully. Expires at:', new Date(this.tokenExpiresAt).toISOString());
                return this.cachedToken;
            }
            throw new Error('Failed to retrieve access token from SerdiPay');
        } catch (error) {
            console.error('Error fetching SerdiPay token:', error.response?.data || error.message);
            throw error;
        }
    }

    async initiatePayment(paymentData) {
        const token = await this.getToken();
        const response = await axios.post(`${this.baseUrl}/merchant/payment-merchant`, {
            api_id: process.env.SERDIPAY_API_ID,
            api_password: process.env.SERDIPAY_API_PASSWORD,
            merchantCode: process.env.SERDIPAY_MERCHANT_CODE,
            merchant_pin: process.env.SERDIPAY_MERCHANT_PIN,
            ...paymentData
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response;
    }
}

module.exports = new SerdiPayService();
