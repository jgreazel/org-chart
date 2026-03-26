FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/backend/tsconfig.json ./apps/backend/tsconfig.json
COPY apps/backend/src ./apps/backend/src
RUN npm install --workspace @ptb/backend && npm run build --workspace @ptb/backend

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/apps/backend/dist ./dist
COPY apps/backend/package.json ./package.json
RUN npm install --omit=dev
ENV PORT=3001
EXPOSE 3001
CMD ["node", "dist/index.js"]
