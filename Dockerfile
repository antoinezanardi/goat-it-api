FROM node:25.4.0-alpine AS base
LABEL maintainer="Antoine ZANARDI"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

RUN npm install -g corepack@0.34.4 --force

RUN corepack enable

RUN mkdir -p "$PNPM_HOME" && chown node:node "$PNPM_HOME"

FROM base AS development

RUN apk add --no-cache bash

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node pnpm-workspace.yaml ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node configs/typescript ./configs/typescript/
COPY --chown=node:node scripts/post-install-prepare.sh ./scripts/post-install-prepare.sh

RUN pnpm install --frozen-lockfile

COPY --chown=node:node src/ src/

CMD [ "pnpm", "run", "start:dev" ]

FROM base AS build

RUN apk add --no-cache bash

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node pnpm-workspace.yaml ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node configs/typescript ./configs/typescript/
COPY --chown=node:node configs/nest ./configs/nest/
COPY --chown=node:node configs/swc ./configs/swc/
COPY --chown=node:node scripts/post-install-prepare.sh ./scripts/post-install-prepare.sh
COPY --chown=node:node src/ src/
COPY --chown=node:node --from=development /app/node_modules node_modules/

RUN pnpm run build

ENV NODE_ENV="production"

RUN pnpm prune --prod

FROM base AS production

USER node

ENV NODE_ENV="production"

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node --from=build /app/node_modules node_modules/
COPY --chown=node:node --from=build /app/dist dist/

CMD [ "pnpm", "run", "start:prod" ]