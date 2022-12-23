## Development Set Up

### Install pnpm
https://pnpm.io/installation

### Use node 18
`pnpm env use --global 18`

### Install dependencies
`pnpm i`

If you get an error like "Expected Version" is 18 but "Got" some older version, run `pnpm add -g pnpm` and try `pnpm i` again.

### Create .env.local files
`cat client/.env.example > client/.env.local`

`cat server/.env.example > server/.env.local`

Change the values in .env.local if you want

### Run the Postgres database

`docker compose -f compose.dev.yaml --env-file server/.env.local up -d`

### Run the app

`pnpm run dev`

## Build Docker Images for Production

[//]: # (TODO: API_URL will need to be the public url of the backend. It will need its own subdomain and nginx config.)

`docker build -t hanamikoji-client --build-arg "API_URL=http://localhost:8000" -f client.Dockerfile .`

`docker build -t hanamikoji-server -f server.Dockerfile .`

### compose prod

`docker compose -f compose.prod.yaml --env-file server/.env.prod up -d`

`docker compose -f compose.prod.yaml down`
