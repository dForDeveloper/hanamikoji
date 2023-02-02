# STAGE 1
FROM node:18.12.1-slim AS build

# install pnpm
RUN npm i -g pnpm@~7.18.2

# set working directory to /app
WORKDIR /app

# copy package.jsons, pnpm files, and tsconfigs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/tsconfig.json ./server/
COPY packages/game-logic/package.json packages/game-logic/tsconfig.json ./packages/game-logic/

# install dependencies
RUN pnpm install

# copy source code
COPY packages/game-logic/ ./packages/game-logic/
COPY server/ ./server/

# build
RUN pnpm run build:shared:cjs
RUN pnpm run build:server

# STAGE 2
FROM node:18.12.1-slim

# same as stage 1 until switching user
RUN npm i -g pnpm@~7.18.2

WORKDIR /app

COPY --from=build app/package.json app/pnpm-lock.yaml app/pnpm-workspace.yaml ./
COPY --from=build app/server/package.json ./server/
COPY --from=build app/packages/game-logic/package.json ./packages/game-logic/

# change owner of /app directory and switch to non-root user
RUN chown -R node:node /app
USER node

# install only production dependencies
RUN pnpm install --prod

# copy only the build files from previous stage
COPY --from=build app/packages/game-logic/build ./packages/game-logic/build/
COPY --from=build app/server/build ./server/build/

# add tini
ENV TINI_VERSION v0.19.0
ADD --chown=node:node https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# define env variables and their default values
ENV NODE_ENV=production
ENV POSTGRES_USER=dev
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_HOST=0.0.0.0
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=hanamikoji

# expose port
EXPOSE 8000

CMD ["node", "server/build/index.js"]
