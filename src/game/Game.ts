import type { Game } from 'boardgame.io';
import { PlayerView } from 'boardgame.io/core';

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
        { charmPoints: 5, color: Color.PINK, favoredPlayerID: null },
        { charmPoints: 4, color: Color.GREEN, favoredPlayerID: null },
        { charmPoints: 3, color: Color.ORANGE, favoredPlayerID: null },
        { charmPoints: 3, color: Color.BLUE, favoredPlayerID: null },
        { charmPoints: 2, color: Color.YELLOW, favoredPlayerID: null },
        { charmPoints: 2, color: Color.RED, favoredPlayerID: null },
        { charmPoints: 2, color: Color.PURPLE, favoredPlayerID: null },
      ],
      players: {
        0: {
          hand: player0Hand,
          actions: {
            0: { enabled: true },
            1: { enabled: true },
            2: { enabled: true },
            3: { enabled: true },
          },
        },
        1: {
          hand: player1Hand,
          actions: {
            0: { enabled: true },
            1: { enabled: true },
            2: { enabled: true },
            3: { enabled: true },
          },
        },
      },
    };
  },
  playerView: PlayerView.STRIP_SECRETS,
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
}

interface ItemCard {
  charmPoints: number;
  color: Color;
}

interface Secret {
  deck: ItemCard[];
  unusedItemCard: ItemCard;
}

interface Actions {
  0: { enabled: boolean };
  1: { enabled: boolean };
  2: { enabled: boolean };
  3: { enabled: boolean };
}

interface Player {
  hand: ItemCard[];
  actions: Actions;
}

interface GameState {
  secret: Secret;
  geisha: GeishaCard[];
  players: { 0: Player; 1: Player };
}
