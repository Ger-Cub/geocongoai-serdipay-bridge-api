exports.verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['api_key'] || req.headers['x-api-key'];
    const validApiKey = process.env.BRIDGE_API_KEY;

    if (!validApiKey) {
        console.warn('BRIDGE_API_KEY is not set in environment variables. API Key check is disabled but recommended.');
        return next();
    }

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    next();
};
