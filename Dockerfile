# --- Stage 1: Build ---
FROM --platform=linux/amd64 node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
# เพิ่มบรรทัดนี้เพื่อใช้ .env ตอน build (ถ้าจำเป็น)
COPY .env ./ 
RUN npm ci

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# --- Stage 2: Run ---
FROM --platform=linux/amd64 node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
# >>> เพิ่มบรรทัดนี้: Copy .env จาก Stage builder มาวางที่ Stage runner <<<
COPY --from=builder /app/.env ./ 

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/providers/database/generated ./src/providers/database/generated

EXPOSE 3131

CMD [ "node", "dist/index.js" ]