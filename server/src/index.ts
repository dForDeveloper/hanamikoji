import { Server, Origins } from 'boardgame.io/server';
import { Hanamikoji } from 'game-logic';
import { PostgresStore } from 'bgio-postgres';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV;

if (env !== 'production') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

const USER = process.env.POSTGRES_USER;
const PW = process.env.POSTGRES_PASSWORD;
const HOST = process.env.POSTGRES_HOST;
const PORT = process.env.POSTGRES_PORT;
const DB = process.env.POSTGRES_DB;

let psqlUri = `postgresql://${USER}:${PW}@${HOST}:${PORT}/${DB}`;

if (env === 'production') {
  psqlUri = `postgresql://${USER}:${PW}@${HOST}/${DB}`;
}

const db = new PostgresStore(psqlUri);

const server = Server({
  games: [Hanamikoji],
  // TODO: change origins to [Origins.LOCALHOST_IN_DEVELOPMENT, 'production front end url']
  origins: [Origins.LOCALHOST_IN_DEVELOPMENT],
  db,
});

server.run(8000);
