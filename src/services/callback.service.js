const axios = require('axios');

class CallbackService {
    /**
     * Envoie les données de webhook à l'URL de callback fournie par le client
     * @param {string} callbackUrl - L'URL où envoyer le callback
     * @param {object} data - Les données à envoyer
     * @returns {Promise}
     */
    async sendCallback(callbackUrl, data) {
        if (!callbackUrl) {
            throw new Error('Callback URL is required');
        }

        try {
            return await axios.post(callbackUrl, data, {
                headers: { 
                    'x-api-key': process.env.CLIENT_CALLBACK_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
        } catch (error) {
            console.error(`Error sending callback to ${callbackUrl}:`, error.message);
            throw error;
        }
    }
}

module.exports = new CallbackService();
