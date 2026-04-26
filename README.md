# GeoCongo SerdiPay Bridge API

Cette API sert de pont entre les applications GeoCongo et le système de paiement SerdiPay. Elle centralise l'authentification, la gestion des jetons et le relais des webhooks.

## Fonctionnalités Clés

* **Gestion Automatisée des Jetons :** Récupération et mise en cache sécurisées des jetons d'accès SerdiPay.
* **Initialisation de Paiement Sécurisée :** Point de terminaison unique pour lancer des transactions.
* **Relais de Webhook :** Intermédiaire pour recevoir les notifications de SerdiPay et les transmettre aux applications GeoCongo.

---

## Guide de Démarrage Rapide

### Prérequis

* Node.js (v18+)
* npm

### Installation Locale

1. **Installer les dépendances :**

    ```bash
    npm install
    ```

2. **Configurer les variables d'environnement :**
    Créez un fichier `.env` à partir de `.env.example` et remplissez les identifiants SerdiPay et GeoCongo.

    ```text
    # Exemple minimal
    PORT=3000
    BRIDGE_API_KEY=votre_cle_api_secrete
    ... (voir .env.example pour la liste complète)
    ```

3. **Lancer en mode développement (watch mode) :**

    ```bash
    npm run dev
    ```

4. **Lancer en mode production :**

    ```bash
    npm start
    ```

### Déploiement Docker

L'API est prête à être déployée via Docker ou sur des plateformes comme Coolify.

1. **Construire l'image :**

    ```bash
    docker build -t geocongo-serdipay-api .
    ```

2. **Lancer le conteneur :**

    ```bash
    docker run -p 3000:3000 --env-file ./.env geocongo-serdipay-api
    ```

---

## Documentation d'Intégration

Si vous souhaitez intégrer cette API dans une autre application de l'écosystème GeoCongo, veuillez consulter le guide détaillé :

👉 **[Documentation SerdiPay Bridge API.md](./Documentation%20SerdiPay%20Bridge%20API.md)**

---

## Structure du Projet

* `src/index.js` : Point d'entrée de l'application.
* `src/routes/` : Définition des points de terminaison.
* `src/services/` : Logique métier (SerdiPay & GeoCongo).
* `src/config/` : Configuration et validation de l'environnement.
