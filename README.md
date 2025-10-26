# 🚗 Car Rental API

API REST moderne pour la gestion de locations de véhicules. Solution complète permettant la gestion des utilisateurs, du parc automobile et des réservations.

---

## 📋 Table des matières

- [Présentation](#présentation)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Base de données](#base-de-données)
- [Démarrage](#démarrage)
- [Documentation API](#documentation-api)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Contribution](#contribution)
- [Auteurs](#auteurs)

---

## 🎯 Présentation

Cette API REST permet de gérer un système complet de location de véhicules. Elle offre les fonctionnalités suivantes :

- **Authentification sécurisée** avec JWT (JSON Web Tokens)
- **Gestion des utilisateurs** (inscription, connexion)
- **Gestion du parc automobile** (ajout, modification, consultation)
- **Système de réservation** (création et suivi des locations)

---

## 🛠 Technologies

- **Runtime** : Node.js (version 18 ou supérieure)
- **Framework** : Express.js
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT (JSON Web Tokens)
- **Langage** : TypeScript/JavaScript

---

## ⚡ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18 minimum)
- [PostgreSQL](https://www.postgresql.org/) (version 13 ou supérieure)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- [Docker](https://www.docker.com/) (optionnel, recommandé pour PostgreSQL)

---

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-username/car-rental-api.git
cd car-rental-api
```

### 2. Installer les dépendances

```bash
npm install
```

---

## ⚙️ Configuration

### Fichier d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration de la base de données
DATABASE_URL="postgresql://myuser:mypassword@localhost:5433/mydb?schema=public"

# Clé secrète pour JWT (à modifier impérativement)
JWT_SECRET=votre_cle_secrete_tres_complexe_et_aleatoire

# Configuration du serveur
PORT=3000
NODE_ENV=development
```

> ⚠️ **Sécurité** : Modifiez obligatoirement `JWT_SECRET` et les identifiants de la base de données avant tout déploiement en production.

---

## 🗄️ Base de données

### Option 1 : Installation avec Docker (Recommandée)

Cette méthode est la plus simple et évite les conflits de ports.

```bash
# Démarrer un conteneur PostgreSQL
docker run --name car-rental-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=mydb \
  -p 5433:5432 \
  -d postgres:15-alpine
```

> 💡 **Note** : Le port `5433` est utilisé pour éviter les conflits avec une installation locale de PostgreSQL (port `5432` par défaut).

### Option 2 : Installation locale de PostgreSQL

Si vous préférez utiliser PostgreSQL installé localement :

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE mydb;

# Créer l'utilisateur
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';

# Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;

# Configurer le schéma (si nécessaire)
\c mydb
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO myuser;

# Quitter
\q
```

### Initialisation de la base de données

#### 1. Appliquer les migrations Prisma

```bash
npx prisma migrate dev --name init
```

Cette commande crée toutes les tables nécessaires (User, Car, Rental).

#### 2. Générer le client Prisma

```bash
npx prisma generate
```

#### 3. Peupler la base avec des données de test (optionnel)

```bash
npm run seed
```

Cela créera automatiquement :

- 3 utilisateurs de test
- 5 véhicules
- 3 locations exemple

#### 4. Vérifier l'installation

```bash
# Se connecter à la base
psql -h localhost -p 5433 -U myuser -d mydb

# Lister les tables
\dt

# Résultat attendu :
#  Schema |        Name          | Type  | Owner
# --------+----------------------+-------+--------
#  public | Car                  | table | myuser
#  public | Rental               | table | myuser
#  public | User                 | table | myuser
#  public | _prisma_migrations   | table | myuser
```

---

## 🚀 Démarrage

### Démarrer le serveur en mode développement

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

### Test rapide de l'API

```bash
curl http://localhost:3000
```

**Réponse attendue** : `🚗 API en route !`

---

## 📚 Documentation API

### 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <VOTRE_TOKEN_JWT>
```

#### Inscription d'un nouvel utilisateur

```http
POST /auth/register
Content-Type: application/json
```

**Body** :

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Réponse (201 Created)** :

```json
{
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Connexion

```http
POST /auth/login
Content-Type: application/json
```

**Body** :

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Réponse (200 OK)** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🚗 Gestion des véhicules

#### Lister toutes les voitures disponibles

```http
GET /cars
Authorization: Bearer <TOKEN>
```

**Réponse (200 OK)** :

```json
[
  {
    "id": 1,
    "brand": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "pricePerDay": 89.99,
    "available": true
  }
]
```

#### Ajouter une nouvelle voiture

```http
POST /newcars
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body** :

```json
{
  "brand": "Tesla",
  "model": "Model 3",
  "year": 2024,
  "pricePerDay": 89.99,
  "available": true
}
```

#### Obtenir les détails d'une voiture

```http
GET /cars/:id
Authorization: Bearer <TOKEN>
```

---

### 📋 Gestion des locations

#### Lister mes locations

```http
GET /rentals
Authorization: Bearer <TOKEN>
```

#### Créer une nouvelle location

```http
POST /rentals
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body** :

```json
{
  "carId": 1,
  "startDate": "2025-11-01",
  "endDate": "2025-11-07"
}
```

**Réponse (201 Created)** :

```json
{
  "id": 1,
  "carId": 1,
  "userId": 1,
  "startDate": "2025-11-01T00:00:00.000Z",
  "endDate": "2025-11-07T00:00:00.000Z",
  "totalPrice": 629.93,
  "status": "PENDING"
}
```

#### Détails d'une location

```http
GET /rentals/:id
Authorization: Bearer <TOKEN>
```

---

## 🧪 Tests avec Postman

### Configuration de l'authentification

1. **Obtenir un token JWT** :

   - Envoyez une requête `POST` à `http://localhost:3000/auth/login`
   - Copiez le token de la réponse

2. **Utiliser le token** :

   - Dans Postman, allez dans l'onglet **Authorization**
   - Sélectionnez le type **Bearer Token**
   - Collez votre token

3. **Astuce** : Créez une variable d'environnement
   - Créez un environnement "Car Rental API"
   - Ajoutez une variable `jwt_token`
   - Utilisez `{{jwt_token}}` dans vos requêtes

### Collection Postman

Vous pouvez importer la collection de tests fournie dans le dossier `/postman`.

---

## 🧪 Tests automatisés

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm run test:coverage
```

---

## 📁 Structure du projet

```
car-rental-api/
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.js
└── src
    ├── index.js
    ├── routes
    │   ├── authRoutes.js
    │   ├── carRoutes.js
    │   └── rentalRoutes.js
    └── utils
        └── auth.js
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
3. Committez vos changements
   ```bash
   git commit -m "Ajout de ma fonctionnalité"
   ```
4. Poussez vers la branche
   ```bash
   git push origin feature/ma-fonctionnalite
   ```
5. Ouvrez une Pull Request

---

## 👥 Auteurs

Développé avec ❤️ par **Zak** et **Youness**

**Contact Zak** : zakariya.belkassem@next-u.fr,

**Contact Youness** :youness.fatine@next-u.fr

---

## 📖 Ressources complémentaires

- [Documentation Express.js](https://expressjs.com/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation JWT](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Année universitaire** : 2024-2025
