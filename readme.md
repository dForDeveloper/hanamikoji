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

[//]: # API_URL will need to be the public url of the backend. it will need its own subdomain and reverse proxy config
`docker build -t hanamikoji-client --build-arg "API_URL=http://localhost:8000" -f client.Dockerfile .`
`docker build -t hanamikoji-server -f server.Dockerfile .`
[//]: # (docker run -d -p 3000:3000 hanamikoji-client)
docker run -d -p 8000:8000 --env "POSTGRES_USER=dev" --env "POSTGRES_PW=password" --env "POSTGRES_HOST=localhost" --env "POSTGRES_PORT=5432" --env "POSTGRES_DB=hanamikoji" hanamikoji-server
docker run -p 8000:8000 --env "POSTGRES_USER=dev" --env "POSTGRES_PW=password" --env "POSTGRES_HOST=localhost" --env "POSTGRES_PORT=5432" --env "POSTGRES_DB=hanamikoji" hanamikoji-server
