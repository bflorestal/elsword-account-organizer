# Elsword Account Organizer

Une application web pour ne plus perdre le fil de vos personnages Elsword : sachez toujours quel personnage se trouve sur quel compte et sur quel serveur.

## Fonctionnalités

- 🎮 Gestion de multiples comptes Elsword
- 👤 Suivi des personnages par compte
- 🏆 Suivi des rangs PvP et des niveaux
- 🌐 Support des serveurs différents

## Technologies utilisées

- **Runtime** : Bun
- **Frontend** : Next.js 16
- **Styling** : Tailwind CSS, Shadcn UI
- **Base de données** : PostgreSQL avec Drizzle ORM
- **Déploiement** : Docker Compose

## Prérequis

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)

## Installation

1. Clonez le repository :

```bash
git clone https://github.com/bflorestal/elsword-account-organizer.git
cd elsword-account-organizer
```

2. Installez les dépendances :

```bash
bun install
```

3. Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Puis modifiez le fichier `.env` avec vos variables d'environnement :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/elsword
```

3. Démarrez PostgreSQL via Docker Compose :

```bash
docker compose up db -d
```

4. Configurez la base de données :

```bash
# Synchronise le schéma avec la base de données
bun run db:push

# (Optionnel) Génère des migrations SQL
bun run db:generate

# Ajoute des données
bun run db:seed
```

## Développement

Pour lancer le serveur de développement (la base de données PostgreSQL doit être active) :

```bash
bun --bun run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Déploiement avec Docker

1. Démarrez l'application et la base de données avec Docker Compose :

```bash
docker compose up --build
```

Cette commande lance :

- **PostgreSQL** sur le port `5432`
- **l'application** sur le port `3000`

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).
