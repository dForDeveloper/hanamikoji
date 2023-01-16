import { INVALID_MOVE } from 'boardgame.io/core';

export enum Phase {
  PLAY = 'play',
  REVEAL = 'reveal',
  SCORE = 'score',
  RESTART = 'restart',
}

export enum Stage {
  DRAW = 'draw',
  SELECT_ACTION = 'selectAction',
  SELECT_CARDS_AS_ACTIVE_PLAYER = 'selectCardsAsActivePlayer',
  SELECT_CARDS_AS_NONACTIVE_PLAYER = 'selectCardsAsNonactivePlayer',
  ACKNOWLEDGE_CHOICE = 'acknowledgeChoice',
  REVEAL = 'reveal',
  ACKNOWLEDGE_REVEAL = 'acknowledgeReveal',
  CALCULATE = 'calculate',
  PREPARE_NEXT_ROUND = 'prepareNextRound',
  READY = 'ready',
  NULL = '',
}

export enum Color {
  PURPLE = 'purple',
  RED = 'red',
  YELLOW = 'yellow',
  BLUE = 'blue',
  ORANGE = 'orange',
  GREEN = 'green',
  PINK = 'pink',
}

export interface GeishaCard {
  color: Color;
  charmPoints: number;
  favoredPlayerID: number | null;
  playerItemCards: Record<string, ItemCard[]>;
}

export interface ItemCard {
  charmPoints: number;
  color: Color;
}

export interface Secret {
  deck: ItemCard[];
  unusedItemCard: ItemCard;
}

export interface Action {
  enabled: boolean;
  savedCard?: ItemCard | null;
  discardedCards?: ItemCard[];
}

export interface Player {
  hand: ItemCard[];
  actions: Record<string, Action>;
  score: { geishaCount: number; charmPoints: number };
}

export interface GameState {
  secret: Secret;
  geisha: Record<Color, GeishaCard>;
  players: Record<string, Player>;
  currentAction: string | null;
  presentedCards: ItemCard[];
  startingPlayerID: string;
  opponentChoice: string;
  revealedCard: ItemCard | null;
}

export interface DeckAndHands {
  deck: ItemCard[];
  unusedItemCard: ItemCard;
  player0Hand: ItemCard[];
  player1Hand: ItemCard[];
}

export type MoveResult = void | GameState | typeof INVALID_MOVE;
