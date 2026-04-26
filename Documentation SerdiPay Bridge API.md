# Guide d'Intégration - SerdiPay Bridge API

Ce document est destiné aux développeurs souhaitant intégrer le système de paiement SerdiPay dans leurs applications via ce pont API.

## Authentification

Toutes les requêtes vers les points de terminaison protégés (🔒) doivent inclure la clé API du pont dans les en-têtes HTTP :

```http
api_key: VOTRE_BRIDGE_API_KEY
```

---

## Référence des Points de Terminaison

| Méthode | Chemin | Sécurité | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Publique | Message de bienvenue et statut de l'API. |
| `GET` | `/health` | Publique | Vérification de l'état de santé du service. |
| `GET` | `/docs` | Publique | Documentation interactive Swagger (UI). |
| `GET` | `/get_token` | 🔒 | Récupère manuellement un jeton SerdiPay (pour test/débogage). |
| `POST` | `/payment_init` | 🔒 | Initialise une transaction de paiement. |
| `POST` | `/webhook` | Publique | Reçoit les notifications de SerdiPay (utilisé par SerdiPay). |

---

## Utilisation des Points de Terminaison

### 1. Initialisation de Paiement (`POST /payment_init`)

**Corps de la requête (JSON) :**

```json
{
  "clientPhone": "243XXXXXXXXX",
  "amount": 1,
  "currency": "USD",
  "telecom": "MP"
}
```

telecom: 'AM' | 'OM' | 'MP' | 'AF';

**Réponse (Succès) :**

```json
{
  "transactionId": "SDP_TRANS_...",
  "status": "PENDING",
  "message": "Payment initiated successfully."
}
```

### 2. Réception des Webhooks (`POST /webhook`)

Le pont reçoit les notifications de SerdiPay et les retransmet automatiquement à l'URL définie par `GEOCONGO_CALLBACK_URL`.

**Payload typique transmis par SerdiPay :**

```json
{
  "transactionId": "SDP_TRANS_...",
  "status": "COMPLETED",
  "amount": 1,
  "currency": "USD",
  "clientPhone": "243XXXXXXXXX"
}
```

---

## Support et Erreurs

L'API retourne des codes d'état HTTP standards :

* `200/201` : Succès.
* `400` : Requête mal formée ou paramètres manquants.
* `401` : Clé API manquante ou invalide.
* `500` : Erreur interne ou problème de communication avec SerdiPay.

Pour plus de détails techniques, consultez la page `/docs` une fois l'API lancée.
