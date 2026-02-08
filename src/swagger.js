const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GeoCongo SerdiPay Bridge API',
      version: '1.0.0',
      description: 'API documentation for GeoCongo SerdiPay Bridge API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'api_key',
        },
      },
    },
  },
  apis: ['./src/index.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;