import { Stage } from 'game-logic';

export const getInstructions = (
  currentAction: string,
  playerStage: Stage | null,
  opponentStage: Stage | null,
): string[] => {
  if (opponentStage) {
    switch (opponentStage) {
      case Stage.DRAW:
        return ["It's your opponent's turn", 'Waiting for them to draw a card.'];
      case Stage.SELECT_ACTION:
        return ['Waiting for your opponent to select an action.'];
      case Stage.SELECT_CARDS_AS_ACTIVE_PLAYER:
        switch (currentAction) {
          case '0':
            return ['Waiting for your opponent to hide 1 card.'];
          case '1':
            return ['Waiting for your opponent to discard 2 cards.'];
          case '2':
            return ['Waiting for your opponent to reveal three cards.'];
          case '3':
            return ['Waiting for your opponent to reveal 2 sets of cards.'];
          default:
            return [''];
        }
      case Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER:
        return [`Waiting for your opponent to choose their ${currentAction === '2' ? 'card' : 'set'}.`];
      case Stage.ACKNOWLEDGE_CHOICE:
        return ['Waiting for your opponent to acknowledge your choice.'];
      case 'reveal':
        return ['Waiting for your opponent to reveal their hidden card.'];
      case Stage.ACKNOWLEDGE_REVEAL:
        return ['Waiting for your opponent to acknowledge your final card.'];
      case Stage.CALCULATE:
        return ['Waiting for your opponent to calculate the score.'];
      case Stage.PREPARE_NEXT_ROUND:
        return ['Waiting for your opponent to ready up.'];
      default:
        return [''];
    }
  } else if (playerStage) {
    switch (playerStage) {
      case Stage.DRAW:
        return ["It's your turn.", 'Draw a card.'];
      case Stage.SELECT_ACTION:
        return ['Select an action from the options below.'];
      case Stage.SELECT_CARDS_AS_ACTIVE_PLAYER:
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
              'They will choose one of the cards to score.',
              'You will score the remaining two cards.',
            ];
          case '3':
            return [
              'Choose 4 cards from your hand separated into two sets of two to reveal to your opponent.',
              'They will choose one set to score.',
              'You will score the remaining set.',
            ];
          default:
            return [''];
        }
      case Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER:
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
            return [''];
        }
      case Stage.ACKNOWLEDGE_CHOICE:
        return ['Your opponent chose this split.'];
      case 'reveal':
        return ['Reveal your hidden card.'];
      case Stage.ACKNOWLEDGE_REVEAL:
        return ['Your opponent revealed their hidden card.'];
      case Stage.CALCULATE:
        return ['Calculate the score.'];
      default:
        return [''];
    }
  } else {
    return [''];
  }
};
