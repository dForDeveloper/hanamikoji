import type { Game } from 'boardgame.io';
import { INVALID_MOVE, Stage } from 'boardgame.io/core';

export const Hanamikoji: Game<GameState> = {
  setup: ({ random }) => {
    const { deck, unusedItemCard, player0Hand, player1Hand } = getDeckAndHands(random);
    return {
      secret: { deck, unusedItemCard },
      geisha: {
        [Color.PINK]: { charmPoints: 5, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
        [Color.GREEN]: { charmPoints: 4, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
        [Color.ORANGE]: { charmPoints: 3, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
        [Color.BLUE]: { charmPoints: 3, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
        [Color.YELLOW]: { charmPoints: 2, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
        [Color.RED]: { charmPoints: 2, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
        [Color.PURPLE]: { charmPoints: 2, favoredPlayerID: null, playerItemCards: { 0: [], 1: [] } },
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
    };
  },

  phases: {
    playPhase: {
      start: true,
      next: 'revealPhase',
      endIf: ({ G }) => {
        const isDeckEmpty = G.secret.deck.length === 0;
        const arePlayersEmptyHanded = G.players[0].hand.length + G.players[1].hand.length === 0;
        const hasNoCurrentAction = G.currentAction === null;
        if (isDeckEmpty && arePlayersEmptyHanded && hasNoCurrentAction) return true;
      },
      turn: {
        activePlayers: { currentPlayer: 'draw' },
        stages: {
          draw: {
            moves: {
              draw: ({ G, ctx, events }) => {
                const currentPlayer = ctx.currentPlayer;
                if (!G.secret.deck.length) {
                  return INVALID_MOVE;
                }
                const card = G.secret.deck.pop()!;
                G.players[currentPlayer].hand.push(card);
                events.endStage();
              },
            },
            next: 'selectAction',
          },

          selectAction: {
            moves: {
              selectAction: ({ G, ctx, events }, selectedAction: string) => {
                const currentPlayer = ctx.currentPlayer;
                const playersActions = G.players[currentPlayer].actions;

                if (!['0', '1', '2', '3'].includes(selectedAction) || !playersActions[selectedAction].enabled) {
                  return INVALID_MOVE;
                }

                G.currentAction = selectedAction;
                playersActions[selectedAction].enabled = false;
                events.endStage();
              },
            },
            next: 'selectCardsAsCurrentPlayer',
          },

          selectCardsAsCurrentPlayer: {
            moves: {
              selectCardsAsCurrent: ({ G, ctx, events }, selectedCardIndexes: string[]) => {
                const currentPlayer = ctx.currentPlayer;
                const currentAction = G.currentAction!;
                const playersAction = G.players[currentPlayer].actions[currentAction];
                const currentPlayerHand = G.players[currentPlayer].hand;

                const hasSelectedIncorrectNumberOfCards = selectedCardIndexes.length !== Number(currentAction) + 1;
                const hasSelectedNonUniqueCards = new Set(selectedCardIndexes).size !== selectedCardIndexes.length;
                const hasSelectedCardsNotInHand = selectedCardIndexes.some((index) => {
                  return currentPlayerHand.at(Number(index)) === undefined;
                });

                if (hasSelectedIncorrectNumberOfCards || hasSelectedNonUniqueCards || hasSelectedCardsNotInHand) {
                  return INVALID_MOVE;
                }

                const selectedCards: ItemCard[] = selectedCardIndexes.map((i) => {
                  return currentPlayerHand.at(Number(i))!;
                });

                G.players[currentPlayer].hand = currentPlayerHand.filter((card, i) => {
                  return !selectedCardIndexes.includes(i.toString());
                });

                switch (currentAction) {
                  case '0':
                    playersAction.savedCard = selectedCards.at(0);
                    G.currentAction = null;
                    events.endStage();
                    events.endTurn();
                    break;
                  case '1':
                    playersAction.discardedCards = selectedCards;
                    G.currentAction = null;
                    events.endStage();
                    events.endTurn();
                    break;
                  case '2':
                    G.presentedCards = selectedCards;
                    events.setActivePlayers({
                      currentPlayer: Stage.NULL,
                      others: 'selectCardsAsOpposingPlayer',
                    });
                    break;
                  case '3':
                    G.presentedPairs = [
                      [selectedCards.at(0)!, selectedCards.at(1)!],
                      [selectedCards.at(2)!, selectedCards.at(3)!],
                    ];
                    events.setActivePlayers({
                      currentPlayer: Stage.NULL,
                      others: 'selectCardsAsOpposingPlayer',
                    });
                    break;
                }
              },
            },
          },

          selectCardsAsOpposingPlayer: {
            moves: {
              selectCardsAsOpposing: ({ G, ctx, events }, selectedIndex: string) => {
                const presentingPlayer = ctx.currentPlayer;
                const choosingPlayer = presentingPlayer === '0' ? '1' : '0';
                const currentAction = G.currentAction!;

                const isValidAction2Selection = ['0', '1', '2'].includes(selectedIndex) && currentAction === '2';
                const isValidAction3Selection = ['0', '1'].includes(selectedIndex) && currentAction === '3';

                if (isValidAction2Selection) {
                  G.presentedCards.forEach((card, i) => {
                    if (i === Number(selectedIndex)) {
                      G.geisha[card.color].playerItemCards[choosingPlayer].push(card);
                    } else {
                      G.geisha[card.color].playerItemCards[presentingPlayer].push(card);
                    }
                  });
                  G.presentedCards = [];
                } else if (isValidAction3Selection) {
                  const unselectedIndex = selectedIndex === '0' ? '1' : '0';
                  G.presentedPairs.forEach((pair, i) => {
                    if (i === Number(selectedIndex)) {
                      pair.forEach((card) => G.geisha[card.color].playerItemCards[choosingPlayer].push(card));
                    } else if (i === Number(unselectedIndex)) {
                      pair.forEach((card) => G.geisha[card.color].playerItemCards[presentingPlayer].push(card));
                    }
                  });
                  G.presentedPairs = [];
                } else {
                  return INVALID_MOVE;
                }

                G.currentAction = null;
                events.setActivePlayers({ all: Stage.NULL });
                events.endTurn();
              },
            },
          },
        },
      },
    },

    revealPhase: {
      next: 'scoringPhase',
      endIf: ({ G }) => {
        const hasPlayer0Revealed = G.players[0].actions[0].savedCard === null;
        const hasPlayer1Revealed = G.players[1].actions[0].savedCard === null;
        if (hasPlayer0Revealed && hasPlayer1Revealed) return true;
      },
      turn: {
        activePlayers: { currentPlayer: 'reveal' },
        stages: {
          reveal: {
            moves: {
              reveal: ({ G, ctx, events }) => {
                const { savedCard } = G.players[ctx.currentPlayer].actions[0];
                if (savedCard !== null && savedCard !== undefined) {
                  G.geisha[savedCard.color].playerItemCards[ctx.currentPlayer].push(savedCard);
                  G.players[ctx.currentPlayer].actions[0].savedCard = null;
                  events.endTurn();
                } else {
                  return INVALID_MOVE;
                }
              },
            },
          },
        },
      },
    },

    scoringPhase: {
      turn: {
        activePlayers: { all: 'calculate', minMoves: 1, maxMoves: 1 },
        stages: {
          calculate: {
            moves: {
              calculateScore: ({ G, events }) => {
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
                    G.players[favoredPlayerID].score.charmPoints =
                      G.players[favoredPlayerID].score.charmPoints + charmPoints;
                  }
                });

                const winner = getWinner(G);
                if (winner !== null) {
                  events.endGame({ winner });
                } else {
                  events.setPhase('restartPhase');
                }
              },
            },
          },
        },
      },
    },

    restartPhase: {
      next: 'playPhase',
      turn: {
        activePlayers: { all: 'prepareNextRound', minMoves: 1, maxMoves: 1 },
        stages: {
          prepareNextRound: {
            moves: {
              goToNextRound: ({ G, events, random }) => {
                setGameStateForNextRound({ G, random });
                events.endTurn({ next: G.startingPlayerID });
                G.startingPlayerID = G.startingPlayerID === '0' ? '1' : '0';
                events.endPhase();
              },
            },
          },
        },
      },
    },
  },

  maxPlayers: 2,

  // playerView: PlayerView.STRIP_SECRETS,
};

function getDeckAndHands(random: Random): DeckAndHands {
  const stackedDeck = [
    ...Array(5).fill({ charmPoints: 5, color: Color.PINK }),
    ...Array(4).fill({ charmPoints: 4, color: Color.GREEN }),
    ...Array(3).fill({ charmPoints: 3, color: Color.ORANGE }),
    ...Array(3).fill({ charmPoints: 3, color: Color.BLUE }),
    ...Array(2).fill({ charmPoints: 2, color: Color.YELLOW }),
    ...Array(2).fill({ charmPoints: 2, color: Color.RED }),
    ...Array(2).fill({ charmPoints: 2, color: Color.PURPLE }),
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

function getWinner(G: GameState): string | null {
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

function setGameStateForNextRound({ G, random }: { G: GameState; random: Random }) {
  const { deck, unusedItemCard, player0Hand, player1Hand } = getDeckAndHands(random);
  G.secret = { deck, unusedItemCard };
  G.geisha = {
    [Color.PINK]: { ...G.geisha[Color.PINK], playerItemCards: { 0: [], 1: [] } },
    [Color.GREEN]: { ...G.geisha[Color.GREEN], playerItemCards: { 0: [], 1: [] } },
    [Color.ORANGE]: { ...G.geisha[Color.ORANGE], playerItemCards: { 0: [], 1: [] } },
    [Color.BLUE]: { ...G.geisha[Color.BLUE], playerItemCards: { 0: [], 1: [] } },
    [Color.YELLOW]: { ...G.geisha[Color.YELLOW], playerItemCards: { 0: [], 1: [] } },
    [Color.RED]: { ...G.geisha[Color.RED], playerItemCards: { 0: [], 1: [] } },
    [Color.PURPLE]: { ...G.geisha[Color.PURPLE], playerItemCards: { 0: [], 1: [] } },
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
}

enum Color {
  PINK = 'pink',
  GREEN = 'green',
  ORANGE = 'orange',
  BLUE = 'blue',
  YELLOW = 'yellow',
  RED = 'red',
  PURPLE = 'purple',
}

interface GeishaCard {
  charmPoints: number;
  favoredPlayerID: number | null;
  playerItemCards: Record<string, ItemCard[]>;
}

interface ItemCard {
  charmPoints: number;
  color: Color;
}

interface Secret {
  deck: ItemCard[];
  unusedItemCard: ItemCard;
}

interface Action {
  enabled: boolean;
  savedCard?: ItemCard | null;
  discardedCards?: ItemCard[];
}

interface Player {
  hand: ItemCard[];
  actions: Record<string, Action>;
  score: { geishaCount: number; charmPoints: number };
}

interface GameState {
  secret: Secret;
  geisha: Record<Color, GeishaCard>;
  players: Record<string, Player>;
  currentAction: string | null;
  presentedCards: ItemCard[];
  presentedPairs: ItemCard[][];
  startingPlayerID: string;
}

interface Random {
  Shuffle<T>(deck: T[]): T[];
}

interface DeckAndHands {
  deck: ItemCard[];
  unusedItemCard: ItemCard;
  player0Hand: ItemCard[];
  player1Hand: ItemCard[];
}
