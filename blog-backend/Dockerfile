FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
