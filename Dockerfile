FROM --platform=$BUILDPLATFORM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS base
LABEL maintainer="Antoine ZANARDI"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

RUN npm install -g corepack --force

RUN corepack enable

RUN mkdir -p "$PNPM_HOME" && chown node:node "$PNPM_HOME"

FROM base AS development

RUN apk add --no-cache bash

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node pnpm-workspace.yaml ./
COPY --chown=node:node packages/schemas/package.json ./packages/schemas/package.json
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node configs/typescript ./configs/typescript/
COPY --chown=node:node scripts/post-install-prepare.sh ./scripts/post-install-prepare.sh

RUN pnpm install --frozen-lockfile

COPY --chown=node:node src/ src/

CMD [ "pnpm", "run", "start:dev" ]

FROM --platform=$BUILDPLATFORM base AS build

RUN apk add --no-cache bash

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node pnpm-workspace.yaml ./
COPY --chown=node:node packages/schemas/package.json ./packages/schemas/package.json
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node configs/typescript ./configs/typescript/
COPY --chown=node:node configs/nest ./configs/nest/
COPY --chown=node:node configs/swc ./configs/swc/
COPY --chown=node:node scripts/post-install-prepare.sh ./scripts/post-install-prepare.sh
COPY --chown=node:node scripts/check-secrets-in-built-output.sh ./scripts/check-secrets-in-built-output.sh
COPY --chown=node:node src/ src/
COPY --chown=node:node --from=development /app/node_modules node_modules/

RUN pnpm run build && pnpm run check:secrets-in-built-output

ENV NODE_ENV="production"

RUN pnpm prune --prod

FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS production

RUN apk add --no-cache tini=0.19.0-r3

USER node

ENV NODE_ENV="production"
ENV SERVER_PORT=3000

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node --from=build /app/node_modules node_modules/
COPY --chown=node:node --from=build /app/dist dist/
COPY --chown=node:node public/ public/

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 -O /dev/null http://127.0.0.1:${SERVER_PORT}/ || exit 1

STOPSIGNAL SIGTERM

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "node", "dist/main.js" ]