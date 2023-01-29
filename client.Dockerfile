# STAGE 1
FROM node:18.12.1-slim AS build

# install pnpm
RUN npm i -g pnpm@~7.18.2

# set working directory to /app
WORKDIR /app

# copy package.jsons, pnpm files, and tsconfigs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json client/tsconfig.json client/.svelte-kit/tsconfig.json ./client/
COPY packages/game-logic/package.json packages/game-logic/tsconfig.json ./packages/game-logic/

# install dependencies
RUN pnpm install

# copy source code
COPY packages/game-logic/ ./packages/game-logic/
COPY client/ ./client/

# declare build arg
ARG API_URL
ARG CLIENT_URL

# set environment variable
ENV PUBLIC_BASE_API_URL=${API_URL}
ENV PUBLIC_BASE_CLIENT_URL=${CLIENT_URL}

# build
RUN pnpm --filter game-logic run build:esm
RUN pnpm run build:client

# STAGE 2
FROM node:18.12.1-slim

# same as stage 1 until switching user
RUN npm i -g pnpm@~7.18.2

WORKDIR /app

COPY --from=build app/package.json app/pnpm-lock.yaml app/pnpm-workspace.yaml ./
COPY --from=build app/client/package.json ./client/
COPY --from=build app/packages/game-logic/package.json ./packages/game-logic/

# change owner of /app directory and switch to non-root user
RUN chown -R node:node /app
USER node

# install only production dependencies
RUN pnpm install --prod

# copy only the build files from previous stage
COPY --from=build app/packages/game-logic/build ./packages/game-logic/build/
COPY --from=build app/client/build ./client/build/

# add tini
ENV TINI_VERSION v0.19.0
ADD --chown=node:node https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# expose port
EXPOSE 3000

CMD ["node", "client/build/index.js"]
