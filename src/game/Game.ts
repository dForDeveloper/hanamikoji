import type { Game } from 'boardgame.io';
import { INVALID_MOVE, Stage } from 'boardgame.io/core';

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
        },
        1: {
          hand: player1Hand,
          actions: {
            0: { enabled: true, savedCard: null },
            1: { enabled: true, discardedCards: [] },
            2: { enabled: true },
            3: { enabled: true },
          },
        },
      },
      currentAction: null,
      presentedCards: [],
      presentedPairs: [],
    };
  },

  turn: {
    activePlayers: { currentPlayer: 'draw' },

    stages: {
      // TODO: maybe add a wait stage for players to evaluate the board position before starting/restarting a round
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
                playersAction.savedCard = selectedCards.at(0);
                G.currentAction = null;
                events.endStage();
                events.endTurn();
                // TODO: check if the round is over. maybe use G.turn.onBegin()?
                break;
              case '1':
                playersAction.discardedCards = selectedCards;
                G.currentAction = null;
                events.endStage();
                events.endTurn();
                // TODO: check if the round is over. maybe use G.turn.onBegin()?
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
            // TODO: check if the round is over or move to draw stage for the player that just chose
          },
        },
      },
    },
  },

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
}

interface GameState {
  secret: Secret;
  geisha: Record<Color, GeishaCard>;
  players: Record<string, Player>;
  currentAction: string | null;
  presentedCards: ItemCard[];
  presentedPairs: ItemCard[][];
}
