# Elsword Account Organizer

Une application web pour ne plus perdre le fil de vos personnages Elsword : sachez toujours quel personnage se trouve sur quel compte et sur quel serveur.

## Fonctionnalités

- 🎮 Gestion de multiples comptes Elsword
- 👤 Suivi des personnages par compte
- 🏆 Suivi des rangs PvP et des niveaux
- 🌐 Support des serveurs différents

## Technologies utilisées

- **Runtime**: Bun
- **Frontend**: Next.js 15
- **Styling**: Tailwind CSS, Shadcn UI
- **Base de données**: SQLite avec Drizzle ORM
- **Déploiement**: Docker

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
DB_FILE_NAME=database.db
```

3. Configurez la base de données :

```bash
# Génère les migrations
bun run db:generate

# Applique les migrations
bun run db:migrate

# Ajoute des données
bun run db:seed
```

## Développement

Pour lancer le serveur de développement :

```bash
bun --bun run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Déploiement avec Docker

1. Construisez l'image Docker avec Docker Compose :

```bash
docker compose up --build
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).
