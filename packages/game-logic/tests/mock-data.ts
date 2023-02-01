import { Color, GameState, GeishaCard, ItemCard, Phase, Player, Stage } from '../src/types';
import { Ctx } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import { vi } from 'vitest';

export const mockInitialDeck: ItemCard[] = [
  ...Array(4).fill({ charmPoints: 4, color: Color.GREEN }),
  ...Array(4).fill({ charmPoints: 5, color: Color.PINK }),
];

const mockUnusedItemCard: ItemCard = { charmPoints: 5, color: Color.PINK };

export const mockInitialGeisha: Record<string, GeishaCard> = {
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
};

const mockHand0: ItemCard[] = [
  ...Array(2).fill({ charmPoints: 2, color: Color.PURPLE }),
  ...Array(2).fill({ charmPoints: 2, color: Color.RED }),
  ...Array(2).fill({ charmPoints: 2, color: Color.YELLOW }),
];

const mockHand1: ItemCard[] = [
  ...Array(3).fill({ charmPoints: 3, color: Color.BLUE }),
  ...Array(3).fill({ charmPoints: 3, color: Color.ORANGE }),
];

const mockInitialPlayers: Record<string, Player> = {
  0: {
    hand: mockHand0,
    actions: {
      0: { enabled: true, savedCard: null },
      1: { enabled: true, discardedCards: [] },
      2: { enabled: true },
      3: { enabled: true },
    },
    score: { geishaCount: 0, charmPoints: 0 },
  },
  1: {
    hand: mockHand1,
    actions: {
      0: { enabled: true, savedCard: null },
      1: { enabled: true, discardedCards: [] },
      2: { enabled: true },
      3: { enabled: true },
    },
    score: { geishaCount: 0, charmPoints: 0 },
  },
};

export const mockInitialGameState: GameState = {
  deck: mockInitialDeck,
  unusedItemCard: mockUnusedItemCard,
  geisha: mockInitialGeisha,
  players: mockInitialPlayers,
  currentAction: null,
  presentedCards: [],
  startingPlayerID: '0',
  opponentChoice: '',
  revealedCard: null,
};

export const mockCtx: Ctx = {
  numPlayers: 2,
  playOrder: ['0', '1'],
  playOrderPos: 0,
  activePlayers: { '0': Stage.DRAW },
  currentPlayer: '0',
  turn: 0,
  phase: Phase.PLAY,
};

export const mockEventsAPI: EventsAPI = {
  endGame: vi.fn(),
  endPhase: vi.fn(),
  endStage: vi.fn(),
  endTurn: vi.fn(),
  pass: vi.fn(),
  setActivePlayers: vi.fn(),
  setPhase: vi.fn(),
  setStage: vi.fn(),
};
