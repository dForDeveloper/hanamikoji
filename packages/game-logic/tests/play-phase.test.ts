import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockInitialGameState, mockCtx, mockEventsAPI } from './mock-data';
import { INVALID_MOVE } from 'boardgame.io/core';
import { draw } from '../src/phases/play';

describe('Play Phase', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('draw move', () => {
    it('returns INVALID_MOVE if the deck is empty', () => {
      const G = structuredClone(mockInitialGameState);
      G.deck = [];

      const result = draw({ G, ctx: mockCtx, events: mockEventsAPI });

      expect(result).toEqual(INVALID_MOVE);
      expect(mockEventsAPI.endStage).toHaveBeenCalledTimes(0);
    });

    it("adds the top card of the deck to the current player's hand", () => {
      const G = structuredClone(mockInitialGameState);
      const topCardBeforeDraw = structuredClone(G.deck.at(-1));

      expect(G.deck).toHaveLength(8);
      expect(G.players[0].hand).toHaveLength(6);
      expect(G.players[0].hand.at(-1)).not.toEqual(topCardBeforeDraw);

      draw({ G, ctx: mockCtx, events: mockEventsAPI });

      expect(G.deck).toHaveLength(7);
      expect(G.players[0].hand).toHaveLength(7);
      expect(G.players[0].hand.at(-1)).toEqual(topCardBeforeDraw);
      expect(mockEventsAPI.endStage).toHaveBeenCalledOnce();
    });
  });
});
