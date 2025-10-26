# 🚗 Car Rental API

API REST moderne pour la gestion de locations de véhicules. Solution complète permettant la gestion des utilisateurs, du parc automobile et des réservations.

## 📋 Table des matières

- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Base de données](#base-de-données)
- [Démarrage](#démarrage)
- [Documentation API](#documentation-api)
- [Tests](#tests)
- [Contribution](#contribution)

## 🛠 Technologies

- **Runtime** : Node.js ≥ 18
- **Framework** : Express.js
- **ORM** : Prisma
- **Base de données** : PostgreSQL
- **Authentification** : JWT (JSON Web Tokens)
- **Langage** : JavaScript/TypeScript

## ⚡ Prérequis

Assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) version 18 ou supérieure
- [PostgreSQL](https://www.postgresql.org/) (local ou Docker)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone <repository-url>
cd car-rental-api
```

### 2. Installer les dépendances

```bash
npm install
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les paramètres suivants :

```env
# Database
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydb?schema=public"

# Security
JWT_SECRET=your_super_secret_key_change_this_in_production

# Server
PORT=3000
NODE_ENV=development
```

> ⚠️ **Important** : Modifiez les valeurs par défaut, notamment `JWT_SECRET`, avant le déploiement en production.

## 🗄️ Base de données

### Configuration PostgreSQL

#### Méthode 1 : Installation locale

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données et l'utilisateur
CREATE DATABASE mydb;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

# Configurer le schéma
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO myuser;
GRANT ALL ON SCHEMA public TO postgres;

# Quitter psql
\q
```

#### Méthode 2 : Docker (recommandé)

```bash
docker run --name car-rental-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Migrations Prisma

Appliquez les migrations pour créer les tables :

```bash
npx prisma migrate dev --name init
```

### Vérification

```bash
# Se connecter à la base
psql -U myuser -d mydb

# Lister les tables
\dt

# Tables attendues : User, Car, Rental, _prisma_migrations
```

## 🚀 Démarrage

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Test rapide

```bash
curl http://localhost:3000
# Réponse attendue : "🚗 API en route !"
```

## 📚 Documentation API

### Authentification

| Méthode | Endpoint         | Description                            | Auth requise |
| ------- | ---------------- | -------------------------------------- | ------------ |
| POST    | `/auth/register` | Inscription d'un nouvel utilisateur    | Non          |
| POST    | `/auth/login`    | Connexion et récupération du token JWT | Non          |

#### Exemple : Inscription

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

#### Exemple : Connexion

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Gestion des voitures

| Méthode | Endpoint    | Description                           | Auth requise |
| ------- | ----------- | ------------------------------------- | ------------ |
| GET     | `/cars`     | Liste toutes les voitures disponibles | Oui          |
| POST    | `/newcars`  | Ajouter une nouvelle voiture          | Oui          |
| GET     | `/cars/:id` | Détails d'une voiture spécifique      | Oui          |

#### Exemple : Ajouter une voiture

```bash
curl -X POST http://localhost:3000/newcars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "brand": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "pricePerDay": 89.99,
    "available": true
  }'
```

### Gestion des locations

| Méthode | Endpoint       | Description                                 | Auth requise |
| ------- | -------------- | ------------------------------------------- | ------------ |
| GET     | `/rentals`     | Liste toutes les locations de l'utilisateur | Oui          |
| POST    | `/rentals`     | Créer une nouvelle location                 | Oui          |
| GET     | `/rentals/:id` | Détails d'une location spécifique           | Oui          |

#### Exemple : Créer une location

```bash
curl -X POST http://localhost:3000/rentals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "carId": 1,
    "startDate": "2025-11-01",
    "endDate": "2025-11-07"
  }'
```

### Authentification des requêtes

Pour les endpoints protégés, incluez le token JWT dans le header :

```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec couverture
npm run test:coverage

# Tests d'intégration
npm run test:integration
```

## 📁 Structure du projet

```
car-rental-api/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   └── utils/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de suivre ces étapes :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion :

- Email : contact@car-rental-api.com
- Issues : [GitHub Issues](https://github.com/your-repo/issues)

---

Développé avec ❤️ par [Votre Nom]
