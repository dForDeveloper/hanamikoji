Install [pnpm](https://pnpm.io/installation)

Use node 18

`pnpm env use --global 18 && nvm use`

Install dependencies

`pnpm i`

Run locally

`pnpm run dev`

Run the Postgres database

`docker compose --env-file .env.dev up -d`
