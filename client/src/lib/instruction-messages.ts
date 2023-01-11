export const getInstructions = (currentAction: string, playerStage: string, opponentStage: string): string[] => {
  const errorMessage = ['ERROR: No player has any available moves to make'];
  if (opponentStage) {
    switch (opponentStage) {
      case 'draw':
        return ["It's your opponent's turn", 'Waiting for them to draw a card.'];
      case 'selectAction':
        return ['Waiting for your opponent to select an action.'];
      case 'selectCardsAsCurrentPlayer':
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
            return errorMessage;
        }
      case 'selectCardsAsOpposingPlayer':
        return [`Waiting for your opponent to choose their ${currentAction === '2' ? 'card' : 'set'}.`];
      case 'acknowledgeOpponentChoice':
        return ['Waiting for your opponent to acknowledge your choice.'];
      case 'reveal':
        return ['Waiting for your opponent to reveal their hidden card.'];
      case 'acknowledgeReveal':
        return ['Waiting for your opponent to acknowledge your final card.'];
      case 'calculate':
        return ['Waiting for your opponent to calculate the score.'];
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
        return ['Select an action from the options below.'];
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
      case 'acknowledgeOpponentChoice':
        return ['Your opponent chose this split.'];
      case 'reveal':
        return ['Reveal your hidden card.'];
      case 'acknowledgeReveal':
        return ['Your opponent revealed their hidden card.'];
      case 'calculate':
        return ['Calculate the score.'];
      case 'prepareNextRound':
        return ['prepareNextRound stage'];
      default:
        return errorMessage;
    }
  } else {
    return errorMessage;
  }
};
