FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

RUN npm install

# Copie du reste du code source
COPY . .

# Port utilisé par Next.js
EXPOSE 3000
CMD ["npm", "run", "dev"]