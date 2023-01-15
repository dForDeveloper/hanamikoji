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
import { getDeckAndHands, readyUp } from './phases/restart';
import { calculateScore } from './phases/score';
import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';
import type { Game } from 'boardgame.io';

export const Hanamikoji: Game<GameState> = {
  name: 'hanamikoji',
  maxPlayers: 2,
  setup: ({ random }) => setupGame(random),
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
            moves: {
              readyUp: {
                move: readyUp,
                client: false,
              },
            },
          },
          [Stage.READY]: {},
        },
      },
    },
  },

  // playerView: PlayerView.STRIP_SECRETS,
};

function setupGame(random: RandomAPI): GameState {
  const { deck, unusedItemCard, player0Hand, player1Hand } = getDeckAndHands(random);
  return {
    secret: { deck, unusedItemCard },
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
    presentedPairs: [],
    startingPlayerID: '0',
    opponentChoice: '',
  };
}

export { Action, Color, GameState, GeishaCard, ItemCard, Player, Stage };
