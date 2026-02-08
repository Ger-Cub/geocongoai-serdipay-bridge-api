# GeoCongo SerdiPay Bridge API

## Project Overview

This project serves as a bridge API, facilitating communication and transactions between GeoCongo applications and the SerdiPay payment system. Its primary functions include:

*   **Automated Token Management:** Securely obtains and caches access tokens from SerdiPay for authenticated requests.
*   **Secure Payment Initialization:** Provides an endpoint to initiate payments via the SerdiPay platform.
*   **Webhook Relay:** Acts as an intermediary to receive webhooks from SerdiPay and relay them to GeoCongo applications.

The API is built using **Node.js** with the **Express.js** framework. It leverages `axios` for HTTP requests, `dotenv` for environment variable management, and `helmet` along with `cors` for basic security and cross-origin resource sharing.

## Building and Running

This project is designed for easy deployment in Docker-based environments, including platforms like Coolify.

### Local Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file based on the provided `.env.example` and fill in the necessary SerdiPay and GeoCongo credentials.

    **`.env.example`**
    ```
    PORT=3000
    SERDIPAY_MERCHANT_EMAIL=your_serdipay_merchant_email
    SERDIPAY_MERCHANT_PASSWORD=your_serdipay_merchant_password
    SERDIPAY_API_ID=your_serdipay_api_id
    SERDIPAY_API_PASSWORD=your_serdipay_api_password
    SERDIPAY_MERCHANT_CODE=your_serdipay_merchant_code
    SERDIPAY_MERCHANT_PIN=your_serdipay_merchant_pin
    GEOCONGO_CALLBACK_URL=your_geocongo_webhook_callback_url
    GEOCONGO_API_KEY=your_geocongo_api_key
    ```

3.  **Run in Development Mode (with file watching):**
    ```bash
    npm run dev
    ```

4.  **Run in Production Mode:**
    ```bash
    npm start
    ```

### Docker Deployment

To build and run the Docker image:

1.  **Build the Docker Image:**
    ```bash
    docker build -t geocongo-serdipay-api .
    ```
2.  **Run the Docker Container:**
    ```bash
    docker run -p 3000:3000 --env-file ./.env geocongo-serdipay-api
    ```
    *Ensure your `.env` file is correctly configured before running the container, or pass environment variables individually.*

## Development Conventions

*   **API Endpoints:** The API defines clear RESTful endpoints for health checks, token retrieval, payment initialization, and webhook handling.
    *   `GET /`: Welcome message.
    *   `GET /health`: Health check.
    *   `GET /get_token`: Retrieves a SerdiPay access token.
    *   `POST /payement_init`: Initiates a payment through SerdiPay.
    *   `POST /webhook`: Receives SerdiPay webhooks and relays them to GeoCongo.
*   **Error Handling:** Includes basic error handling for API calls and missing request parameters, returning appropriate HTTP status codes and messages.
*   **Code Structure:** Follows a standard Node.js project structure with `src/index.js` as the main entry point.
*   **Dependencies:** Managed via `package.json`, with core dependencies including `express`, `axios`, `dotenv`, `helmet`, and `cors`.
