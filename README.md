Car Rental API 🚗
Équipe

Zak Oqzak – Authentification, gestion des voitures et des locations

Technologies

Node.js + Express + PostgreSQL + Prisma + JWT + Docker

Installation
# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env

# Appliquer les migrations Prisma
npx prisma migrate dev

# Lancer le serveur
npm run dev


Avec Docker Compose :

docker compose up --build

Routes
Auth

POST /auth/register → Inscription

POST /auth/login → Connexion et récupération du token JWT

Voitures

GET /cars → Lister toutes les voitures (JWT requis)

POST /newcars → Ajouter une voiture (JWT requis)

Locations

GET /rentals → Lister toutes les locations de l’utilisateur connecté (JWT requis)

POST /rentals → Créer une location pour une voiture (JWT requis)