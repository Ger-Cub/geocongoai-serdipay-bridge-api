require('dotenv').config();
const { validateEnv } = require('./config/env');
validateEnv();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Bridge API GeoCongo-SerdiPay démarrée sur le port ${PORT}`);
});
