import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
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
    case '3':
      G.presentedCards = selectedCards;
      events.setActivePlayers({
        currentPlayer: Stage.NULL,
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
      others: Stage.NULL,
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
    if (G.presentedCards.length !== 4) {
      return INVALID_MOVE;
    }

    const choosingPlayerCards: ItemCard[] = [];
    const presentingPlayerCards: ItemCard[] = [];

    if (opponentChoice === '0') {
      choosingPlayerCards.push(G.presentedCards[0]);
      choosingPlayerCards.push(G.presentedCards[1]);
      presentingPlayerCards.push(G.presentedCards[2]);
      presentingPlayerCards.push(G.presentedCards[3]);
    } else if (opponentChoice === '1') {
      presentingPlayerCards.push(G.presentedCards[0]);
      presentingPlayerCards.push(G.presentedCards[1]);
      choosingPlayerCards.push(G.presentedCards[2]);
      choosingPlayerCards.push(G.presentedCards[3]);
    }

    choosingPlayerCards.forEach((card) => G.geisha[card.color].playerItemCards[choosingPlayer].push(card));
    presentingPlayerCards.forEach((card) => G.geisha[card.color].playerItemCards[presentingPlayer].push(card));

    G.presentedCards = [];
  } else {
    return INVALID_MOVE;
  }

  G.opponentChoice = '';
  G.currentAction = null;
  events.setActivePlayers({ all: Stage.NULL });
  events.endTurn();
}
