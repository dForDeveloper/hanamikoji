import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import { Action, GameState, MoveResult, Stage } from '../types';

export function endRevealPhaseIf({ G }: { G: GameState }): boolean | void | { next: string } {
  const hasPlayer0Revealed = G.players[0].actions[0].savedCard === null;
  const hasPlayer1Revealed = G.players[1].actions[0].savedCard === null;
  const isNoRevealedCardToAcknowledge = G.revealedCard === null;
  if (hasPlayer0Revealed && hasPlayer1Revealed && isNoRevealedCardToAcknowledge) return true;
}

export function reveal({ G, ctx, events }: { G: GameState; ctx: Ctx; events: EventsAPI }): MoveResult {
  const currentPlayer: string = ctx.currentPlayer;
  const currentPlayersAction0: Action = G.players[currentPlayer].actions[0];

  if (!currentPlayersAction0.savedCard) {
    return INVALID_MOVE;
  }

  G.revealedCard = currentPlayersAction0.savedCard;
  G.players[currentPlayer].actions[0].savedCard = null;

  events.setActivePlayers({
    currentPlayer: Stage.NULL,
    others: Stage.ACKNOWLEDGE_REVEAL,
  });
}

export function acknowledgeReveal({ G, ctx, events }: { G: GameState; ctx: Ctx; events: EventsAPI }): MoveResult {
  if (!G.revealedCard) {
    return INVALID_MOVE;
  }
  G.geisha[G.revealedCard.color].playerItemCards[ctx.currentPlayer].push(G.revealedCard);
  G.revealedCard = null;
  events.endTurn();
}
