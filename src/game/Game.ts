import type { Game, Move } from 'boardgame.io';

export const Hanamikoji: Game<GameState> = {
  setup: ({ random }) => {
    return {
      deck: random.Shuffle(generateDeck()),
      geisha: [
        { charmPoints: 5, color: Color.PINK, favoredPlayerID: null },
        { charmPoints: 4, color: Color.GREEN, favoredPlayerID: null },
        { charmPoints: 3, color: Color.ORANGE, favoredPlayerID: null },
        { charmPoints: 3, color: Color.BLUE, favoredPlayerID: null },
        { charmPoints: 2, color: Color.YELLOW, favoredPlayerID: null },
        { charmPoints: 2, color: Color.RED, favoredPlayerID: null },
        { charmPoints: 2, color: Color.PINK, favoredPlayerID: null },
      ],
    };
  },
}

const generateDeck = (): ItemCard[] => {
  return [
    ...Array(5).fill({ charmPoints: 5, color: Color.PINK }),
    ...Array(4).fill({ charmPoints: 4, color: Color.GREEN }),
    ...Array(3).fill({ charmPoints: 3, color: Color.ORANGE }),
    ...Array(3).fill({ charmPoints: 3, color: Color.BLUE }),
    ...Array(2).fill({ charmPoints: 2, color: Color.YELLOW }),
    ...Array(2).fill({ charmPoints: 2, color: Color.RED }),
    ...Array(2).fill({ charmPoints: 2, color: Color.PINK }),
  ];
};

enum Color {
  PINK = 'pink',
  GREEN = 'green',
  ORANGE = 'orange',
  BLUE = 'blue',
  YELLOW = 'yellow',
  RED = 'red',
  PURPLE = 'purple'
}

interface GeishaCard {
  charmPoints: number;
  color: Color;
  favoredPlayerID: number | null;
}
interface ItemCard {
  charmPoints: number
  color: Color;
}

interface GameState {
  deck: ItemCard[]
  geisha: GeishaCard[]
}
