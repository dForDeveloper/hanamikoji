<script lang="ts">
  import AcknowledgeChoice from '$lib/components/AcknowledgeChoice.svelte';
  import AcknowledgeReveal from '$lib/components/AcknowledgeReveal.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import PresentedCardAreaActivePlayer from '$lib/components/PresentedCardAreaActivePlayer.svelte';
  import PresentedCardAreaNonactivePlayer from '$lib/components/PresentedCardAreaNonactivePlayer.svelte';
  import SelectedCardAreaActivePlayer from '$lib/components/SelectedCardAreaActivePlayer.svelte';
  import SelectedCardAreaNonactivePlayer from '$lib/components/SelectedCardAreaNonactivePlayer.svelte';
  import ShareableLink from '$lib/components/ShareableLink.svelte';
  import { Stage } from 'game-logic';
  import { getInstructions } from '$lib/instruction-messages';
  import type { Action, GameState, ItemCard, Player } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let G: GameState;
  export let hasGameStarted: boolean;
  export let matchID: string;
  export let playerID: string;
  export let opponentID: string;
  export let playerStage: Stage;
  export let opponentStage: Stage;
  export let currentAction: string;
  export let selectedCards: SelectedCard[];
  export let selectedFromPresented: string;
  export let winnerID: string;
  export let getPlayer: (G: GameState, id: string) => Player;
  export let drawCard: () => void;
  export let undoAction: () => void;
  export let selectCardsAsCurrent: (selectedIndexes: string[]) => void;
  export let selectCardsAsOpposing: (selectedIndex: string) => void;
  export let acknowledgeChoice: () => void;
  export let acknowledgeReveal: () => void;
  export let calculateScore: () => void;
  export let readyUp: () => void;
  export let setSelectedFromPresented: (updatedPresentedSelection: string) => void;

  function confirmSelection(selectedCards: SelectedCard[], selectedFromPresented: string, playerStage: Stage): void {
    if (playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER) {
      const selectedCardIndexes = selectedCards
        .filter((maybeCard) => maybeCard !== null)
        .map((itemCard) => itemCard!.index.toString());
      selectCardsAsCurrent(selectedCardIndexes);
    } else if (playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER) {
      selectCardsAsOpposing(selectedFromPresented);
    }
  }

  function getIsConfirmationButtonDisabled(
    selectedCards: SelectedCard[],
    selectedFromPresented: string,
    playerStage: Stage,
  ): boolean {
    if (playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER) {
      const requiredSelectedCardCount = Number(currentAction) + 1;
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      return nonNullSelectedCardCount !== requiredSelectedCardCount;
    } else if (playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER) {
      return selectedFromPresented === '';
    } else {
      throw new Error('Confirmation button should not exist');
    }
  }

  function getPresentedCards(G: GameState): ItemCard[] {
    return G.presentedCards;
  }

  function getOpponentChoice(G: GameState): string {
    return G.opponentChoice;
  }

  function getRevealedCard(G: GameState): ItemCard {
    if (!G.revealedCard) {
      throw new Error('Revealed card should exist');
    }
    return G.revealedCard;
  }

  function getIsActionUndoable(G: GameState, id: string): boolean {
    const player = getPlayer(G, id);
    return Object.values(player.actions).some((action: Action) => action.enabled);
  }

  function getScoreMessages(G: GameState, playerID: string, opponentID: string, winnerID: string): string[] {
    const playerScore = getPlayer(G, playerID).score;
    const opponentScore = getPlayer(G, opponentID).score;
    const messages = [
      `You have ${playerScore.charmPoints} points and ${playerScore.geishaCount} Geisha.`,
      `They have ${opponentScore.charmPoints} points and ${opponentScore.geishaCount} Geisha.`,
    ];
    if (winnerID === playerID) {
      messages.push('You win! 🎉');
    } else if (winnerID === opponentID) {
      messages.push('You lose. 😞');
    } else {
      messages.push("The game's still on. Ready for another round?");
    }
    return messages;
  }
</script>

{#if hasGameStarted}
  {#if playerStage === Stage.ACKNOWLEDGE_CHOICE || opponentStage === Stage.ACKNOWLEDGE_CHOICE}
    <AcknowledgeChoice
      presentedCards={getPresentedCards(G)}
      opponentChoice={getOpponentChoice(G)}
      {playerStage}
      {opponentStage}
      {currentAction}
      {acknowledgeChoice}
    />
  {:else if playerStage === Stage.ACKNOWLEDGE_REVEAL || opponentStage === Stage.ACKNOWLEDGE_REVEAL}
    <AcknowledgeReveal
      revealedCard={getRevealedCard(G)}
      {playerStage}
      {opponentStage}
      {currentAction}
      {acknowledgeReveal}
    />
  {:else}
    <section aria-label="game-interface" class="grid grid-rows-[1fr_16.2vh_1fr]">
      <div aria-label="instruction" class="place-self-center max-w-prose h-full">
        {#if playerStage === Stage.PREPARE_NEXT_ROUND || winnerID}
          {#each getScoreMessages(G, playerID, opponentID, winnerID) as message}
            <p class="text-3xl my-6">{message}</p>
          {/each}
        {:else}
          {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
            <p class="text-3xl my-6">{instruction}</p>
          {/each}
        {/if}
      </div>
      <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
        {#if playerStage === Stage.DRAW || opponentStage === Stage.DRAW}
          <Deck handleClick={() => drawCard()} isDisabled={playerStage !== Stage.DRAW} />
        {:else if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER}
          <SelectedCardAreaActivePlayer {currentAction} {selectedCards} />
        {:else if playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER}
          <PresentedCardAreaActivePlayer
            presentedCards={getPresentedCards(G)}
            {currentAction}
            {selectedFromPresented}
            {setSelectedFromPresented}
          />
        {:else if opponentStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER}
          <SelectedCardAreaNonactivePlayer {currentAction} />
        {:else if opponentStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER}
          <PresentedCardAreaNonactivePlayer {G} {currentAction} {getPresentedCards} />
        {:else if playerStage === Stage.CALCULATE && !winnerID}
          <button
            on:click={() => calculateScore()}
            class="bg-violet-300 text-xl h-12 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 self-center"
          >
            calculate
          </button>
        {:else if playerStage === Stage.PREPARE_NEXT_ROUND}
          <button
            on:click={() => readyUp()}
            class="bg-violet-300 text-xl h-12 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 self-center"
          >
            ready
          </button>
        {/if}
      </div>
      <div class="flex pt-10 justify-center gap-8">
        {#if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER && getIsActionUndoable(G, playerID)}
          <button
            on:click={() => undoAction()}
            class="bg-pink-200 text-xl h-12 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600"
          >
            undo
          </button>
        {/if}
        {#if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER || playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER}
          <button
            on:click={() => confirmSelection(selectedCards, selectedFromPresented, playerStage)}
            disabled={getIsConfirmationButtonDisabled(selectedCards, selectedFromPresented, playerStage)}
            class="bg-violet-300 text-xl h-12 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:bg-gray-300 disabled:shadow-none"
          >
            confirm
          </button>
        {/if}
      </div>
    </section>
  {/if}
{:else}
  <section class="grid grid-rows-[1fr_16.2vh_1fr]">
    <ShareableLink {matchID} />
    <div class="flex flex-row justify-center space-x-2">
      <Deck handleClick={() => false} isDisabled={true} />
    </div>
  </section>
{/if}
