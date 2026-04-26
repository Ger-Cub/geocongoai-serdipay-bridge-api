# SerdiPay Bridge API - Guide d'utilisation générique

## 📋 Vue d'ensemble

Cette API est un **bridge générique** qui permet à n'importe quelle application de notre écosystème d'initier des paiements via SerdiPay et de recevoir les réponses directement sur leur propre URL de callback.

## 🔐 Authentification

Toutes les requêtes aux endpoints protégés doivent inclure la clé `BRIDGE_API_KEY` dans l'en-tête HTTP:

```http
Header: api_key: <BRIDGE_API_KEY>
ou
Header: x-api-key: <BRIDGE_API_KEY>
```

## 🚀 Utilisation

### 1. Initier un paiement

**Endpoint:** `POST /payment/initiate`

**Headers requis:**
```http
api_key: <BRIDGE_API_KEY>
Content-Type: application/json
```

**Body:**
```json
{
  "clientPhone": "+243812345678",
  "amount": 100,
  "currency": "USD",
  "telecom": "MP",
  "callback_url": "https://your-app.com/payment-callback"
}
```

**Paramètres:**
- `clientPhone` (string, requis): Numéro de téléphone du client
- `amount` (number, requis): Montant du paiement
- `currency` (string, requis): Devise (ex: USD, CDF)
- `telecom` (string, requis): Opérateur télécom (MP, AM, OM, AF.)
- `callback_url` (string, requis): **URL où vous recevrez la réponse du paiement**

**Réponse:**
```json
{
  "status": 200,
  "data": {
    "transactionId": "TXN123456",
    "status": "PENDING"
  }
}
```

### 2. Recevoir le callback

Votre application doit avoir un endpoint qui peut recevoir les données de paiement. Cet endpoint sera appelé par l'API Bridge avec les paramètres de paiement.

**En-têtes reçus:**
```http
x-api-key: <CLIENT_CALLBACK_API_KEY>
Content-Type: application/json
```

**Body reçu:**
```json
{
  "transactionId": "TXN123456",
  "status": "SUCCESS",
  "clientPhone": "+243812345678",
  "amount": 100,
  "currency": "USD",
  "callback_url": "https://your-app.com/payment-callback",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 📝 Exemple complet

### Coté client (votre application)

```javascript
// 1. Initier un paiement
const initiatePayment = async () => {
  const response = await fetch('https://bridge-api.com/payment/initiate', {
    method: 'POST',
    headers: {
      'api_key': 'your_bridge_api_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientPhone: '+243812345678',
      amount: 100,
      currency: 'USD',
      telecom: 'MP',
      callback_url: 'https://your-app.com/api/payment-callback'
    })
  });
  
  const data = await response.json();
  console.log('Payment initiated:', data);
};

// 2. Recevoir le callback (endpoint Express/Node.js)
app.post('/api/payment-callback', (req, res) => {
  // Vérifier la signature (x-api-key header)
  const apiKey = req.headers['x-api-key'];
  
  const paymentData = req.body;
  console.log('Payment callback received:', paymentData);
  
  // Traiter le paiement (mise à jour BDD, notification client, etc.)
  if (paymentData.status === 'SUCCESS') {
    // Marquer la commande comme payée
  }
  
  res.status(200).json({ status: 'OK' });
});
```

## 🔄 Flux de paiement

```
Votre App                    Bridge API                   SerdiPay
   |                            |                            |
   |---(initiatePayment)-------->|                            |
   |                            |----(initiate payment)------>|
   |                            |<-----(transaction ID)-------|
   |<---(return transaction)-----|                            |
   |                            |                            |
   |          [Attendre le webhook SerdiPay]                  |
   |                            |<-----(webhook)-------------|
   |<---(callback avec résultat)---|                            |
   |                            |                            |
```

## ✅ Checklist d'intégration

- [ ] Vous avez la clé `BRIDGE_API_KEY` de l'administrateur
- [ ] Vous avez créé un endpoint pour recevoir les callbacks
- [ ] L'endpoint de callback est accessible publiquement (HTTPS requis)
- [ ] Vous validez la clé `x-api-key` reçue dans les callbacks
- [ ] Vous gérez les cas d'erreur et les retry si nécessaire
- [ ] Votre application stocke les `transactionId` pour traçabilité

## 🛠️ Dépannage

**La requête de paiement échoue avec "callback_url is required"**
- Vérifiez que vous envoyez le champ `callback_url` dans votre requête

**Je ne reçois pas les callbacks**
- Vérifiez que votre `callback_url` est accessible publiquement
- Vérifiez les logs de votre application pour voir les requêtes entrantes
- Assurez-vous que votre endpoint retourne un statut 2xx

**Erreur d'authentification (401)**
- Vérifiez que vous envoyez la bonne `BRIDGE_API_KEY`
- Vérifiez l'en-tête: soit `api_key` soit `x-api-key`

