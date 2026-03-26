# Plan d'Amélioration - GeoCongo SerdiPay Bridge API

Ce document répertorie les pistes d'amélioration identifiées et suit l'état de leur mise en œuvre.

## 1. Architecture et Organisation du Code 🏗️
- [x] Refactoriser `src/index.js` en modules distincts.
- [x] Créer `src/routes/` pour les points d'entrée.
- [x] Créer `src/controllers/` pour la logique de traitement.
- [x] Créer `src/services/` pour les appels API externes (SerdiPay/GeoCongo).
- [x] Créer `src/middlewares/` pour la validation et la sécurité.

## 2. Sécurité 🔒
- [ ] Implémenter la validation des signatures/IP pour le Webhook.
- [x] Ajouter un middleware de vérification de clé API (`ApiKeyAuth`).
- [x] Restreindre ou supprimer l'accès public à `/get_token`.

## 3. Fiabilité et Validation ✅
- [ ] Intégrer une bibliothèque de validation (ex: Joi ou Zod).
- [x] Centraliser la gestion des erreurs avec un middleware global.
- [x] Valider la présence des variables d'environnement au démarrage.

## 4. Observabilité (Logs) 📈
- [ ] Remplacer `console.log` par une bibliothèque de logging (Winston ou Pino).
- [ ] Structurer les logs en JSON pour la production.

## 5. Qualité et Standards 🛠️
- [x] Renommer `/payement_init` en `/payment_init` (pour le standard).
- [ ] Ajouter des tests unitaires et d'intégration (Jest + Supertest).
- [ ] Documenter les schémas de réponse plus précisément dans Swagger.
