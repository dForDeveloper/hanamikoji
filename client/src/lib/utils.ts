import type { Ctx } from 'boardgame.io';
import type { Player } from '$lib/types';

const LOCAL_STORAGE_KEY = 'hanamikojiPlayerData';

export const getPlayerData = (): Player => {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (item) {
    return JSON.parse(item);
  }
  return { name: '', credentials: '' };
};

export const setPlayerData = (player: Player): Player => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(player));
  return player;
};

export const getInstructions = (currentAction: string, playerStage: string, opponentStage: string): string[] => {
  const errorMessage = ['ERROR: No player has any available moves to make'];
  if (opponentStage) {
    switch (opponentStage) {
      case 'draw':
        return ["It's your opponent's turn", 'Waiting for them to draw a card...'];
      case 'selectAction':
        return ['Waiting for opponent to select an action'];
      case 'selectCardsAsCurrentPlayer':
        return ['Waiting for opponent to select cards'];
      case 'selectCardsAsOpposingPlayer':
        return ['Waiting for opponent to select cards'];
      case 'reveal':
        return ['Opponent in reveal stage'];
      case 'calculate':
        return ['Opponent in calculate stage'];
      case 'prepareNextRound':
        return ['Opponent in prepareNextRound stage'];
      default:
        return errorMessage;
    }
  } else if (playerStage) {
    switch (playerStage) {
      case 'draw':
        return ["It's your turn.", 'Draw a card.'];
      case 'selectAction':
        return ['Select an action.'];
      case 'selectCardsAsCurrentPlayer':
        switch (currentAction) {
          case '0':
            return [
              'Choose 1 card from your hand.',
              'This card will be hidden from your opponent.',
              'At the end of the round you will reveal and score this card.',
            ];
          case '1':
            return [
              'Choose 2 cards from your hand.',
              "These cards will be hidden from your opponent and won't be scored this round.",
            ];
          case '2':
            return [
              'Choose 3 cards from your hand to reveal to your opponent.',
              'They will choose one of the cards to score for themself.',
              'You will score the remaining two cards.',
            ];
          case '3':
            return [
              'Choose 4 cards from your hand separated into two sets of two to reveal to your opponent.',
              'They will choose one set to score for themself.',
              'You will score the remaining set.',
            ];
          default:
            return errorMessage;
        }
      case 'selectCardsAsOpposingPlayer':
        switch (currentAction) {
          case '2':
            return [
              'Your opponent revealed these cards.',
              'Choose one of them to score for yourself.',
              'They will score the remaining cards.',
            ];
          case '3':
            return [
              'Your opponent revealed these sets of cards',
              'Choose one to score for yourself.',
              'They will score the remaining set.',
            ];
          default:
            return errorMessage;
        }
      case 'reveal':
        return ['reveal stage'];
      case 'calculate':
        return ['calculate stage'];
      case 'prepareNextRound':
        return ['prepareNextRound stage'];
      default:
        return errorMessage;
    }
  } else {
    return errorMessage;
  }
};
