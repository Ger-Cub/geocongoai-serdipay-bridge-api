const axios = require('axios');

class GeoCongoService {
    async relayWebhook(data) {
        return axios.post(process.env.GEOCONGO_CALLBACK_URL, data, {
            headers: { 'x-api-key': process.env.GEOCONGO_API_KEY }
        });
    }
}

module.exports = new GeoCongoService();
