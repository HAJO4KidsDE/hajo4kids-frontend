# Build stage: Node 22.12+ required by Nuxt 4; use npm install so optional
# deps (e.g. oxc-parser linux bindings) are installed correctly in Docker.
FROM node:22.12-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

# Use npm install (not npm ci) to avoid optional-deps bug in Docker
# https://github.com/npm/cli/issues/4828
RUN npm install

COPY . .
RUN npm run build

# Production stage: only .output + Node
FROM node:22.12-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]