## Development Set Up

### Install pnpm
https://pnpm.io/installation

### Use node 18
`pnpm env use --global 18`

### Install dependencies
`pnpm i`

If you get an error like "Expected Version" is 18 but "Got" some older version, run `pnpm add -g pnpm` and try `pnpm i` again.

### Create .env.local files
`cat .env.example > .env.local`
`cat client/.env.example > client/.env.local`

Add your own values for Postgres username and password to .env.local

### Run the Postgres database

`docker compose --env-file .env.local up -d`

### Run the app

`pnpm run dev`
