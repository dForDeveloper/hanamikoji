import { Server, Origins } from 'boardgame.io/server';
import { Hanamikoji } from 'game-logic';

const server = Server({
  games: [Hanamikoji],
  origins: [Origins.LOCALHOST_IN_DEVELOPMENT],
});

server.run(8000);
