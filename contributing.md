## Development Set Up

**Install pnpm**

https://pnpm.io/installation

**Use node 20**

`pnpm env use --global 20`

**Install dependencies**

`pnpm i`

If you get an error, first try `pnpm add -g pnpm` and then `pnpm i` again.

**Run the Postgres database**

`docker compose --env-file server/.env.local up -d`

or if you are using `docker-compose`:

`docker-compose --env-file server/.env.local up -d`

**Build the shared package**

Run this before running the app for the first time and after making any changes to the game-logic package.

`pnpm run build:shared` 

**Run the app**

`pnpm run dev`

**Run tests**

`pnpm run test`
