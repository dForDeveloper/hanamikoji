import type { Game } from 'boardgame.io';

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
        0: player0Hand,
        1: player1Hand,
      },
    };
  },
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

interface Players {
  0: ItemCard[];
  1: ItemCard[];
}

interface GameState {
  secret: Secret;
  geisha: GeishaCard[];
  players: Players;
}
