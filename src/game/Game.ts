import type { Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

export const Hanamikoji: Game<GameState> = {
  setup: ({ random }) => {
    const deck: ItemCard[] = random.Shuffle(generateDeck());
    const unusedItemCard: ItemCard = deck.pop()!;
    const player0Hand: ItemCard[] = [];
    const player1Hand: ItemCard[] = [];
    for (let i = 0; i < 6; i++) {
      player0Hand.push(deck.pop()!);
      player1Hand.push(deck.pop()!);
    }

    return {
      secret: { deck, unusedItemCard },
      geisha: [
        { charmPoints: 5, color: Color.PINK, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
        { charmPoints: 4, color: Color.GREEN, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
        { charmPoints: 3, color: Color.ORANGE, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
        { charmPoints: 3, color: Color.BLUE, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
        { charmPoints: 2, color: Color.YELLOW, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
        { charmPoints: 2, color: Color.RED, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
        { charmPoints: 2, color: Color.PURPLE, favoredPlayerID: null, player0Cards: [], player1Cards: [] },
      ],
      players: {
        '0': {
          hand: player0Hand,
          actions: {
            '0': { enabled: true, savedCard: null },
            '1': { enabled: true, discardedCards: [] },
            '2': { enabled: true },
            '3': { enabled: true },
          },
        },
        '1': {
          hand: player1Hand,
          actions: {
            '0': { enabled: true, savedCard: null },
            '1': { enabled: true, discardedCards: [] },
            '2': { enabled: true },
            '3': { enabled: true },
          },
        },
      },
      currentAction: null,
      presentedCards: [],
    };
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
          selectCards: ({ G, ctx, events }, selectedCardIndexes: string[]) => {
            const currentPlayer = ctx.currentPlayer;
            const currentAction = G.currentAction!;
            const playersAction = G.players[currentPlayer].actions[currentAction];
            const currentPlayerHand = G.players[currentPlayer].hand;

            const incorrectNumberOfSelectedCards = selectedCardIndexes.length !== Number(currentAction) + 1;
            const selectedCardsNotInHand = selectedCardIndexes.some((index) => {
              return currentPlayerHand.at(Number(index)) === undefined;
            });

            if (incorrectNumberOfSelectedCards || selectedCardsNotInHand) {
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
                playersAction.savedCard = selectedCards[0];
                events.endStage();
                events.endTurn();
                break;
              case '1':
                playersAction.discardedCards = selectedCards;
                break;
              case '2':
                G.presentedCards = selectedCards;

                break;
              case '3':
                G.presentedCards = selectedCards;

                break;
            }
          },
        },
      },
    },
  },

  // moves: {
  //   selectAction: ({ G, ctx }, selectedAction: string ) => {
  //     const currentPlayer = ctx.currentPlayer;
  //     const playersActions = G.players[currentPlayer].actions;
  //
  //     if (!playersActions[selectedAction].enabled) {
  //       return INVALID_MOVE;
  //     }
  //
  //     G.currentAction = selectedAction;
  //     playersActions[selectedAction].enabled = false;
  //   },
  // },

  maxPlayers: 2,

  // playerView: PlayerView.STRIP_SECRETS,
};

const generateDeck = (): ItemCard[] => {
  return [
    ...Array(5).fill({ charmPoints: 5, color: Color.PINK }),
    ...Array(4).fill({ charmPoints: 4, color: Color.GREEN }),
    ...Array(3).fill({ charmPoints: 3, color: Color.ORANGE }),
    ...Array(3).fill({ charmPoints: 3, color: Color.BLUE }),
    ...Array(2).fill({ charmPoints: 2, color: Color.YELLOW }),
    ...Array(2).fill({ charmPoints: 2, color: Color.RED }),
    ...Array(2).fill({ charmPoints: 2, color: Color.PURPLE }),
  ];
};

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
  color: Color;
  favoredPlayerID: number | null;
  player0Cards: ItemCard[];
  player1Cards: ItemCard[];
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
}

interface GameState {
  secret: Secret;
  geisha: GeishaCard[];
  players: Record<string, Player>;
  currentAction: string | null;
  presentedCards: ItemCard[];
}
