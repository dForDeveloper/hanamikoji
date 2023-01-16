import { Action, Color, GameState, GeishaCard, ItemCard, Phase, Player, Stage } from './types';
import {
  acknowledgeOpponentChoice,
  draw,
  endPlayPhaseIf,
  selectAction,
  selectCardsAsCurrent,
  selectCardsAsOpposing,
} from './phases/play';
import { acknowledgeReveal, endRevealPhaseIf, reveal } from './phases/reveal';
import { randomizeDeckAndHands, readyUp } from './phases/restart';
import { calculateScore } from './phases/score';
import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';
import type { Game } from 'boardgame.io';

export const Hanamikoji: Game<GameState> = {
  name: 'hanamikoji',
  maxPlayers: 2,
  setup: ({ random }) => setupGame(random),
  playerView: stripSecrets,
  phases: {
    [Phase.PLAY]: {
      start: true,
      next: Phase.REVEAL,
      endIf: endPlayPhaseIf,
      turn: {
        activePlayers: { currentPlayer: Stage.DRAW },
        stages: {
          [Stage.DRAW]: {
            moves: { draw: draw },
            next: Stage.SELECT_ACTION,
          },
          [Stage.SELECT_ACTION]: {
            moves: { selectAction: selectAction },
            next: Stage.SELECT_CARDS_AS_ACTIVE_PLAYER,
          },
          [Stage.SELECT_CARDS_AS_ACTIVE_PLAYER]: {
            moves: { selectCardsAsCurrent: selectCardsAsCurrent },
          },
          [Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER]: {
            moves: { selectCardsAsOpposing: selectCardsAsOpposing },
          },
          [Stage.ACKNOWLEDGE_CHOICE]: {
            moves: { acknowledgeOpponentChoice: acknowledgeOpponentChoice },
          },
        },
      },
    },

    [Phase.REVEAL]: {
      next: Phase.SCORE,
      endIf: endRevealPhaseIf,
      turn: {
        activePlayers: { currentPlayer: Stage.REVEAL },
        stages: {
          [Stage.REVEAL]: {
            moves: { reveal: reveal },
          },
          [Stage.ACKNOWLEDGE_REVEAL]: {
            moves: { acknowledgeReveal: acknowledgeReveal },
          },
        },
      },
    },

    [Phase.SCORE]: {
      turn: {
        activePlayers: { currentPlayer: Stage.CALCULATE },
        stages: {
          [Stage.CALCULATE]: {
            moves: { calculateScore: calculateScore },
          },
        },
      },
    },

    [Phase.RESTART]: {
      next: Phase.PLAY,
      turn: {
        activePlayers: { all: Stage.PREPARE_NEXT_ROUND },
        stages: {
          [Stage.PREPARE_NEXT_ROUND]: {
            moves: { readyUp: readyUp },
          },
          [Stage.READY]: {},
        },
      },
    },
  },
};

function setupGame(random: RandomAPI): GameState {
  const { deck, unusedItemCard, player0Hand, player1Hand } = randomizeDeckAndHands(random);
  return {
    deck,
    unusedItemCard,
    geisha: {
      [Color.PURPLE]: {
        color: Color.PURPLE,
        charmPoints: 2,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
      [Color.RED]: {
        color: Color.RED,
        charmPoints: 2,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
      [Color.YELLOW]: {
        color: Color.YELLOW,
        charmPoints: 2,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
      [Color.BLUE]: {
        color: Color.BLUE,
        charmPoints: 3,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
      [Color.ORANGE]: {
        color: Color.ORANGE,
        charmPoints: 3,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
      [Color.GREEN]: {
        color: Color.GREEN,
        charmPoints: 4,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
      [Color.PINK]: {
        color: Color.PINK,
        charmPoints: 5,
        favoredPlayerID: null,
        playerItemCards: { 0: [], 1: [] },
      },
    },
    players: {
      0: {
        hand: player0Hand,
        actions: {
          0: { enabled: true, savedCard: null },
          1: { enabled: true, discardedCards: [] },
          2: { enabled: true },
          3: { enabled: true },
        },
        score: { geishaCount: 0, charmPoints: 0 },
      },
      1: {
        hand: player1Hand,
        actions: {
          0: { enabled: true, savedCard: null },
          1: { enabled: true, discardedCards: [] },
          2: { enabled: true },
          3: { enabled: true },
        },
        score: { geishaCount: 0, charmPoints: 0 },
      },
    },
    currentAction: null,
    presentedCards: [],
    startingPlayerID: '0',
    opponentChoice: '',
    revealedCard: null,
  };
}

function stripSecrets({ G, playerID }: { G: GameState; playerID: string | null }): GameState {
  if (!playerID) {
    throw new Error('Cannot strip secrets from player view');
  }
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  const opponent = G.players[opponentPlayerID];
  return {
    deck: G.deck ? stripItemCards(G.deck) : [],
    unusedItemCard: { charmPoints: 0, color: Color.NULL },
    geisha: G.geisha,
    players: {
      [playerID]: G.players[playerID],
      [opponentPlayerID]: {
        hand: opponent.hand ? stripItemCards(opponent.hand) : [],
        actions: {
          0: {
            enabled: opponent.actions[0].enabled,
            savedCard: opponent.actions[0].savedCard ? { charmPoints: 0, color: Color.NULL } : null,
          },
          1: {
            enabled: opponent.actions[1].enabled,
            discardedCards: opponent.actions[1].discardedCards
              ? stripItemCards(opponent.actions[1].discardedCards)
              : [],
          },
          2: { enabled: opponent.actions[2].enabled },
          3: { enabled: opponent.actions[3].enabled },
        },
        score: opponent.score,
      },
    },
    currentAction: G.currentAction,
    presentedCards: G.presentedCards,
    startingPlayerID: G.startingPlayerID,
    opponentChoice: G.opponentChoice,
    revealedCard: G.revealedCard,
  };
}

function stripItemCards(itemCards: ItemCard[]) {
  return itemCards.map((card) => {
    return { charmPoints: 0, color: Color.NULL };
  });
}

export { Action, Color, GameState, GeishaCard, ItemCard, Player, Stage };
