FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY tsconfig.base.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/frontend/tsconfig.json ./apps/frontend/tsconfig.json
COPY apps/frontend/index.html ./apps/frontend/index.html
COPY apps/frontend/src ./apps/frontend/src
COPY apps/frontend/vite.config.ts ./apps/frontend/vite.config.ts
COPY libs/shared-types/package.json ./libs/shared-types/package.json
COPY libs/shared-types/src ./libs/shared-types/src
RUN npm install --workspace @ptb/frontend
RUN npm run build --workspace @ptb/frontend

FROM nginx:1.27-alpine
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
