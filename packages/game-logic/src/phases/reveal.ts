import { Ctx } from 'boardgame.io';
import { INVALID_MOVE, Stage as BoardgameIOStage } from 'boardgame.io/core';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import { GameState, MoveResult, Stage } from '../types';

export function endRevealPhaseIf({ G }: { G: GameState }): boolean | void | { next: string } {
  const hasPlayer0Revealed = G.players[0].actions[0].savedCard === null;
  const hasPlayer1Revealed = G.players[1].actions[0].savedCard === null;
  if (hasPlayer0Revealed && hasPlayer1Revealed) return true;
}

export function reveal({ events }: { events: EventsAPI }): MoveResult {
  events.setActivePlayers({
    currentPlayer: BoardgameIOStage.NULL,
    others: Stage.ACKNOWLEDGE_REVEAL,
  });
}

export function acknowledgeReveal({ G, ctx, events }: { G: GameState; ctx: Ctx; events: EventsAPI }): MoveResult {
  const { savedCard } = G.players[ctx.currentPlayer].actions[0];
  if (savedCard !== null && savedCard !== undefined) {
    G.geisha[savedCard.color].playerItemCards[ctx.currentPlayer].push(savedCard);
    G.players[ctx.currentPlayer].actions[0].savedCard = null;
    events.endTurn();
  } else {
    return INVALID_MOVE;
  }
}
