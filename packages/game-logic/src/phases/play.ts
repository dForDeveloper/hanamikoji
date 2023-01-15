import { Ctx } from 'boardgame.io';
import { INVALID_MOVE, Stage as BoardgameIOStage } from 'boardgame.io/core';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/events/events';
import { GameState, ItemCard, MoveResult, Stage } from '../types';

export function endPlayPhaseIf({ G }: { G: GameState }): boolean | void | { next: string } {
  const isDeckEmpty = G.secret.deck.length === 0;
  const arePlayersEmptyHanded = G.players[0].hand.length + G.players[1].hand.length === 0;
  const hasNoCurrentAction = G.currentAction === null;
  if (isDeckEmpty && arePlayersEmptyHanded && hasNoCurrentAction) return true;
}

export function draw({ G, ctx, events }: { G: GameState; ctx: Ctx; events: EventsAPI }): MoveResult {
  const currentPlayer = ctx.currentPlayer;
  if (!G.secret.deck.length) {
    return INVALID_MOVE;
  }
  const card = G.secret.deck.pop()!;
  G.players[currentPlayer].hand.push(card);
  events.endStage();
}

export function selectAction(
  { G, ctx, events }: { G: GameState; ctx: Ctx; events: EventsAPI },
  selectedAction: string,
): MoveResult {
  const currentPlayer = ctx.currentPlayer;
  const playersActions = G.players[currentPlayer].actions;

  if (!['0', '1', '2', '3'].includes(selectedAction) || !playersActions[selectedAction].enabled) {
    return INVALID_MOVE;
  }

  G.currentAction = selectedAction;
  playersActions[selectedAction].enabled = false;
  events.endStage();
}

export function selectCardsAsCurrent(
  { G, ctx, events }: { G: GameState; ctx: Ctx; events: EventsAPI },
  selectedCardIndexes: string[],
): MoveResult {
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
        currentPlayer: BoardgameIOStage.NULL,
        others: Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER,
      });
      break;
    case '3':
      G.presentedPairs = [
        [selectedCards.at(0)!, selectedCards.at(1)!],
        [selectedCards.at(2)!, selectedCards.at(3)!],
      ];
      events.setActivePlayers({
        currentPlayer: BoardgameIOStage.NULL,
        others: Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER,
      });
      break;
  }
}

export function selectCardsAsOpposing(
  { G, events }: { G: GameState; events: EventsAPI },
  selectedIndex: string,
): MoveResult {
  const currentAction = G.currentAction;

  const isValidAction2Selection = ['0', '1', '2'].includes(selectedIndex) && currentAction === '2';
  const isValidAction3Selection = ['0', '1'].includes(selectedIndex) && currentAction === '3';

  if (isValidAction2Selection || isValidAction3Selection) {
    G.opponentChoice = selectedIndex;
    events.setActivePlayers({
      currentPlayer: Stage.ACKNOWLEDGE_CHOICE,
      others: BoardgameIOStage.NULL,
    });
  } else {
    return INVALID_MOVE;
  }
}

export function acknowledgeOpponentChoice({
  G,
  ctx,
  events,
}: {
  G: GameState;
  ctx: Ctx;
  events: EventsAPI;
}): MoveResult {
  const presentingPlayer = ctx.currentPlayer;
  const choosingPlayer = presentingPlayer === '0' ? '1' : '0';
  const currentAction = G.currentAction;
  const opponentChoice = G.opponentChoice;

  if (currentAction === '2' && opponentChoice) {
    G.presentedCards.forEach((card, i) => {
      if (i === Number(opponentChoice)) {
        G.geisha[card.color].playerItemCards[choosingPlayer].push(card);
      } else {
        G.geisha[card.color].playerItemCards[presentingPlayer].push(card);
      }
    });
    G.presentedCards = [];
  } else if (currentAction === '3') {
    const unselectedIndex = opponentChoice === '0' ? '1' : '0';
    G.presentedPairs.forEach((pair, i) => {
      if (i === Number(opponentChoice)) {
        pair.forEach((card) => G.geisha[card.color].playerItemCards[choosingPlayer].push(card));
      } else if (i === Number(unselectedIndex)) {
        pair.forEach((card) => G.geisha[card.color].playerItemCards[presentingPlayer].push(card));
      }
    });
    G.presentedPairs = [];
  } else {
    return INVALID_MOVE;
  }

  G.opponentChoice = '';
  G.currentAction = null;
  events.setActivePlayers({ all: BoardgameIOStage.NULL });
  events.endTurn();
}

/*
function tieTheGame(G: any, events: any) {
  G.secret.deck = [];
  (G.players = {
    0: {
      hand: [],
      actions: {
        0: { enabled: false, savedCard: { charmPoints: 2, color: Color.PURPLE } },
        1: {
          enabled: false,
          discardedCards: [
            { charmPoints: 2, color: Color.PURPLE },
            { charmPoints: 2, color: Color.RED },
          ],
        },
        2: { enabled: false },
        3: { enabled: false },
      },
      score: { geishaCount: 0, charmPoints: 0 },
    },
    1: {
      hand: [],
      actions: {
        0: { enabled: false, savedCard: { charmPoints: 2, color: Color.YELLOW } },
        1: {
          enabled: false,
          discardedCards: [
            { charmPoints: 2, color: Color.YELLOW },
            { charmPoints: 2, color: Color.RED },
          ],
        },
        2: { enabled: false },
        3: { enabled: false },
      },
      score: { geishaCount: 0, charmPoints: 0 },
    },
  }),
    (G.geisha = {
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
        playerItemCards: {
          0: [{ charmPoints: 3, color: Color.BLUE }],
          1: [
            { charmPoints: 3, color: Color.BLUE },
            { charmPoints: 3, color: Color.BLUE },
          ],
        },
      },
      [Color.ORANGE]: {
        color: Color.ORANGE,
        charmPoints: 3,
        favoredPlayerID: null,
        playerItemCards: {
          0: [
            { charmPoints: 3, color: Color.ORANGE },
            { charmPoints: 3, color: Color.ORANGE },
          ],
          1: [{ charmPoints: 3, color: Color.ORANGE }],
        },
      },
      [Color.GREEN]: {
        color: Color.GREEN,
        charmPoints: 4,
        favoredPlayerID: null,
        playerItemCards: {
          0: [
            { charmPoints: 4, color: Color.GREEN },
            { charmPoints: 4, color: Color.GREEN },
          ],
          1: [
            { charmPoints: 4, color: Color.GREEN },
            { charmPoints: 4, color: Color.GREEN },
          ],
        },
      },
      [Color.PINK]: {
        color: Color.PINK,
        charmPoints: 5,
        favoredPlayerID: null,
        playerItemCards: {
          0: [
            { charmPoints: 5, color: Color.PINK },
            { charmPoints: 5, color: Color.PINK },
          ],
          1: [
            { charmPoints: 5, color: Color.PINK },
            { charmPoints: 5, color: Color.PINK },
          ],
        },
      },
    });
  events.endTurn({ next: '0' });
}

function winTheGame(G: any, events: any) {
  G.secret.deck = [];
  (G.players = {
    0: {
      hand: [],
      actions: {
        0: { enabled: false, savedCard: { charmPoints: 2, color: Color.PURPLE } },
        1: {
          enabled: false,
          discardedCards: [
            { charmPoints: 5, color: Color.PINK },
            { charmPoints: 5, color: Color.PINK },
          ],
        },
        2: { enabled: false },
        3: { enabled: false },
      },
      score: { geishaCount: 0, charmPoints: 0 },
    },
    1: {
      hand: [],
      actions: {
        0: { enabled: false, savedCard: { charmPoints: 5, color: Color.PINK } },
        1: {
          enabled: false,
          discardedCards: [
            { charmPoints: 4, color: Color.GREEN },
            { charmPoints: 4, color: Color.GREEN },
          ],
        },
        2: { enabled: false },
        3: { enabled: false },
      },
      score: { geishaCount: 0, charmPoints: 0 },
    },
  }),
    (G.geisha = {
      [Color.PURPLE]: {
        color: Color.PURPLE,
        charmPoints: 2,
        favoredPlayerID: null,
        playerItemCards: { 0: [{ charmPoints: 2, color: Color.PURPLE }], 1: [] },
      },
      [Color.RED]: {
        color: Color.RED,
        charmPoints: 2,
        favoredPlayerID: null,
        playerItemCards: {
          0: [
            { charmPoints: 2, color: Color.RED },
            { charmPoints: 2, color: Color.RED },
          ],
          1: [],
        },
      },
      [Color.YELLOW]: {
        color: Color.YELLOW,
        charmPoints: 2,
        favoredPlayerID: null,
        playerItemCards: {
          0: [],
          1: [
            { charmPoints: 2, color: Color.YELLOW },
            { charmPoints: 2, color: Color.YELLOW },
          ],
        },
      },
      [Color.BLUE]: {
        color: Color.BLUE,
        charmPoints: 3,
        favoredPlayerID: null,
        playerItemCards: {
          0: [
            { charmPoints: 3, color: Color.BLUE },
            { charmPoints: 3, color: Color.BLUE },
            { charmPoints: 3, color: Color.BLUE },
          ],
          1: [],
        },
      },
      [Color.ORANGE]: {
        color: Color.ORANGE,
        charmPoints: 3,
        favoredPlayerID: null,
        playerItemCards: {
          0: [
            { charmPoints: 3, color: Color.ORANGE },
            { charmPoints: 3, color: Color.ORANGE },
            { charmPoints: 3, color: Color.ORANGE },
          ],
          1: [],
        },
      },
      [Color.GREEN]: {
        color: Color.GREEN,
        charmPoints: 4,
        favoredPlayerID: null,
        playerItemCards: {
          0: [],
          1: [
            { charmPoints: 4, color: Color.GREEN },
            { charmPoints: 4, color: Color.GREEN },
          ],
        },
      },
      [Color.PINK]: {
        color: Color.PINK,
        charmPoints: 5,
        favoredPlayerID: null,
        playerItemCards: {
          0: [],
          1: [
            { charmPoints: 5, color: Color.PINK },
            { charmPoints: 5, color: Color.PINK },
          ],
        },
      },
    });
  events.endTurn({ next: '0' });
}
*/
