FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm i --only=production
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
