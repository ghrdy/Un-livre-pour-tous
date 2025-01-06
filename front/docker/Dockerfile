# Utiliser une image de base officielle Node.js
FROM node:alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Installer un serveur HTTP pour servir les fichiers statiques
RUN npm install -g serve

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer le serveur HTTP pour servir les fichiers statiques
CMD ["serve", "-s", "dist"]