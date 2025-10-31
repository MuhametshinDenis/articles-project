FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable && yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

COPY .env .env

RUN corepack enable && yarn install --frozen-lockfile --production

EXPOSE 8000

CMD ["node", "dist/main.js"]
