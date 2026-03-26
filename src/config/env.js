const requiredEnvVars = [
    'SERDIPAY_MERCHANT_EMAIL',
    'SERDIPAY_MERCHANT_PASSWORD',
    'SERDIPAY_API_ID',
    'SERDIPAY_API_PASSWORD',
    'SERDIPAY_MERCHANT_CODE',
    'SERDIPAY_MERCHANT_PIN',
    'GEOCONGO_CALLBACK_URL',
    'GEOCONGO_API_KEY',
    'BRIDGE_API_KEY'
];

exports.validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
    console.log('✅ Environment variables validated.');
};
