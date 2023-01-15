import { Ctx } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import { Color, DeckAndHands, GameState, ItemCard, MoveResult, Stage } from '../types';
import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';

export function readyUp({
  G,
  ctx,
  events,
  random,
  playerID,
}: {
  G: GameState;
  ctx: Ctx;
  events: EventsAPI;
  random: RandomAPI;
  playerID: string;
}): MoveResult {
  const isPlayer0Ready = ctx.activePlayers && ctx.activePlayers[0] === Stage.READY;
  const isPlayer1Ready = ctx.activePlayers && ctx.activePlayers[1] === Stage.READY;
  if ((playerID === '0' && isPlayer1Ready) || (playerID === '1' && isPlayer0Ready)) {
    setGameStateForNextRound({ G, random });
    events.endTurn({ next: G.startingPlayerID });
    G.startingPlayerID = G.startingPlayerID === '0' ? '1' : '0';
    events.endPhase();
  } else {
    events.setStage(Stage.READY);
  }
}

function setGameStateForNextRound({ G, random }: { G: GameState; random: RandomAPI }) {
  const { deck, unusedItemCard, player0Hand, player1Hand } = getDeckAndHands(random);
  G.secret = { deck, unusedItemCard };
  G.geisha = {
    [Color.PURPLE]: { ...G.geisha[Color.PURPLE], playerItemCards: { 0: [], 1: [] } },
    [Color.RED]: { ...G.geisha[Color.RED], playerItemCards: { 0: [], 1: [] } },
    [Color.YELLOW]: { ...G.geisha[Color.YELLOW], playerItemCards: { 0: [], 1: [] } },
    [Color.BLUE]: { ...G.geisha[Color.BLUE], playerItemCards: { 0: [], 1: [] } },
    [Color.ORANGE]: { ...G.geisha[Color.ORANGE], playerItemCards: { 0: [], 1: [] } },
    [Color.GREEN]: { ...G.geisha[Color.GREEN], playerItemCards: { 0: [], 1: [] } },
    [Color.PINK]: { ...G.geisha[Color.PINK], playerItemCards: { 0: [], 1: [] } },
  };
  G.players = {
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
  };
  G.currentAction = null;
  G.presentedCards = [];
  G.presentedPairs = [];
  G.opponentChoice = '';
}

export function getDeckAndHands(random: RandomAPI): DeckAndHands {
  const stackedDeck = [
    ...Array(2).fill({ charmPoints: 2, color: Color.PURPLE }),
    ...Array(2).fill({ charmPoints: 2, color: Color.RED }),
    ...Array(2).fill({ charmPoints: 2, color: Color.YELLOW }),
    ...Array(3).fill({ charmPoints: 3, color: Color.BLUE }),
    ...Array(3).fill({ charmPoints: 3, color: Color.ORANGE }),
    ...Array(4).fill({ charmPoints: 4, color: Color.GREEN }),
    ...Array(5).fill({ charmPoints: 5, color: Color.PINK }),
  ];

  const deck: ItemCard[] = random.Shuffle(stackedDeck);
  const unusedItemCard: ItemCard = deck.pop()!;
  const player0Hand: ItemCard[] = [];
  const player1Hand: ItemCard[] = [];
  for (let i = 0; i < 6; i++) {
    player0Hand.push(deck.pop()!);
    player1Hand.push(deck.pop()!);
  }

  return { deck, unusedItemCard, player0Hand, player1Hand };
}
