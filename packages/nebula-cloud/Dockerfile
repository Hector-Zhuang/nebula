# ---------- build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency install
COPY package.json nest-cli.json tsconfig.json tsconfig.build.json ./
COPY prisma ./prisma/

RUN npm install --ignore-scripts
RUN npx prisma generate

# Copy source and build
COPY src ./src/
RUN npx nest build

# ---------- runtime stage ----------
FROM node:20-alpine

WORKDIR /app

# Install production deps only
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts

# Copy Prisma schema + generated client
COPY prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled output (includes dist/prisma/seed.js)
COPY --from=builder /app/dist ./dist/

# Create upload directory
RUN mkdir -p /app/storage

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Push schema to DB, run seed (compiled JS), then start
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/prisma/seed.js && node dist/src/main"]
