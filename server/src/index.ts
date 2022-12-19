import { Server, Origins } from 'boardgame.io/server';
import { Hanamikoji } from 'game-logic';
import { PostgresStore } from 'bgio-postgres';
import * as dotenv from 'dotenv';

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

console.log('process.env.POSTGRES_DB', process.env.POSTGRES_DB)
const USER = process.env.POSTGRES_USER;
const PW = process.env.POSTGRES_PW;
const HOST = process.env.POSTGRES_HOST;
const PORT = process.env.POSTGRES_PORT;
const DB = process.env.POSTGRES_DB;

const db = new PostgresStore(`postgresql://${USER}:${PW}@${HOST}:${PORT}/${DB}`);

const server = Server({
  games: [Hanamikoji],
  origins: [Origins.LOCALHOST_IN_DEVELOPMENT],
  db,
});

server.run(8000);
