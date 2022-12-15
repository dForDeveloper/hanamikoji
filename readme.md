Install [pnpm](https://pnpm.io/installation)

Use node 18

`pnpm env use --global 18`

Install dependencies

`pnpm i`

Run the Postgres database

`docker compose --env-file .env.dev up -d`

Run the app

`pnpm run dev`
