import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/plugin-events';
import { Color, GameState, GeishaCard, MoveResult, Phase } from '../types';

export function calculateScore({ G, events }: { G: GameState; events: EventsAPI }): MoveResult {
  G.players[0].score = { geishaCount: 0, charmPoints: 0 };
  G.players[1].score = { geishaCount: 0, charmPoints: 0 };

  Object.keys(G.geisha).forEach((color) => {
    const geisha: GeishaCard = G.geisha[color as Color];
    const { charmPoints, favoredPlayerID, playerItemCards } = geisha;
    if (playerItemCards[0].length > playerItemCards[1].length) {
      G.players[0].score.geishaCount = G.players[0].score.geishaCount + 1;
      G.players[0].score.charmPoints = G.players[0].score.charmPoints + charmPoints;
      geisha.favoredPlayerID = 0;
    } else if (playerItemCards[1].length > playerItemCards[0].length) {
      G.players[1].score.geishaCount = G.players[1].score.geishaCount + 1;
      G.players[1].score.charmPoints = G.players[1].score.charmPoints + charmPoints;
      geisha.favoredPlayerID = 1;
    } else if (favoredPlayerID !== null) {
      G.players[favoredPlayerID].score.geishaCount = G.players[favoredPlayerID].score.geishaCount + 1;
      G.players[favoredPlayerID].score.charmPoints = G.players[favoredPlayerID].score.charmPoints + charmPoints;
    }
  });

  const winner = findWinner(G);
  if (winner !== null) {
    events.endGame({ winner });
  } else {
    events.setPhase(Phase.RESTART);
  }
}

function findWinner(G: GameState): string | null {
  const player0score = G.players[0].score;
  const player1score = G.players[1].score;
  const isPlayer0Victory =
    player0score.charmPoints >= 11 || (player0score.geishaCount >= 4 && player1score.charmPoints < 11);
  const isPlayer1Victory =
    player1score.charmPoints >= 11 || (player1score.geishaCount >= 4 && player0score.charmPoints < 11);
  if (isPlayer0Victory) return '0';
  if (isPlayer1Victory) return '1';
  return null;
}
