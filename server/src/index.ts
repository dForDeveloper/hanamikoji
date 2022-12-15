import { Server, Origins } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import { Hanamikoji } from 'game-logic';

const db = new PostgresStore('postgresql://root:password@localhost:5432/postgres');

const server = Server({
  games: [Hanamikoji],
  origins: [Origins.LOCALHOST_IN_DEVELOPMENT],
  db,
});

server.run(8000);
