<script lang="ts">
  import AcknowledgeChoice from '$lib/components/AcknowledgeChoice.svelte';
  import AcknowledgeReveal from '$lib/components/AcknowledgeReveal.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import PresentedCardAreaActivePlayer from '$lib/components/PresentedCardAreaActivePlayer.svelte';
  import PresentedCardAreaNonactivePlayer from '$lib/components/PresentedCardAreaNonactivePlayer.svelte';
  import SelectedCardAreaActivePlayer from '$lib/components/SelectedCardAreaActivePlayer.svelte';
  import SelectedCardAreaNonactivePlayer from '$lib/components/SelectedCardAreaNonactivePlayer.svelte';
  import { getInstructions } from '$lib/instruction-messages';
  import type { Action, GameState, ItemCard, Player } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let G: GameState;
  export let playerID: string;
  export let opponentPlayerID: string;
  export let playerStage: string;
  export let opponentStage: string;
  export let currentAction: string;
  export let selectedCards: SelectedCard[];
  export let selectedPresentedIndex: string;
  export let getPlayer: (G: GameState, id: string) => Player;
  export let drawCard: () => void;
  export let undoAction: () => void;
  export let selectCardsAsCurrent: (selectedIndexes: string[]) => void;
  export let selectCardsAsOpposing: (selectedIndex: string) => void;
  export let acknowledgeChoice: () => void;
  export let acknowledgeReveal: () => void;
  export let calculateScore: () => void;
  export let setSelectedPresentedIndex: (updatedPresentedSelection: string) => void;

  function selectFromPresented(currentAction: string, i: number): void {
    if (currentAction === '2') {
      setSelectedPresentedIndex(i.toString());
    } else if (currentAction === '3') {
      if (i <= 1) setSelectedPresentedIndex('0');
      if (i >= 2) setSelectedPresentedIndex('1');
    }
  }

  function deselectFromPresented(): void {
    setSelectedPresentedIndex('');
  }

  function confirmSelection(selectedCards: SelectedCard[], selectedPresentedIndex: string): void {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const selectedCardIndexes = selectedCards
        .filter((maybeCard) => maybeCard !== null)
        .map((itemCard) => itemCard!.index.toString());
      selectCardsAsCurrent(selectedCardIndexes);
    } else if (playerStage === 'selectCardsAsOpposingPlayer') {
      selectCardsAsOpposing(selectedPresentedIndex);
    }
  }

  function getIsConfirmationButtonDisabled(selectedCards: SelectedCard[], selectedPresentedIndex: string): boolean {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const requiredSelectedCardCount = Number(currentAction) + 1;
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      return nonNullSelectedCardCount !== requiredSelectedCardCount;
    } else if (playerStage === 'selectCardsAsOpposingPlayer') {
      return selectedPresentedIndex === '';
    } else {
      throw new Error('Confirmation button should not exist');
    }
  }

  function getPresentedCards(G: GameState, currentAction: string): ItemCard[] {
    if (currentAction === '2') {
      return G.presentedCards;
    } else if (currentAction === '3') {
      return G.presentedPairs.flat();
    } else {
      throw new Error('Presented cards should not exist');
    }
  }

  function getOpponentChoice(G: GameState): string {
    return G.opponentChoice;
  }

  function getRevealedCard(G: GameState, playerStage: string, opponentStage: string): ItemCard {
    let player;

    if (playerStage === 'acknowledgeReveal') {
      player = getPlayer(G, opponentPlayerID);
    } else if (opponentStage === 'acknowledgeReveal') {
      player = getPlayer(G, playerID);
    }

    if (player && player.actions[0].savedCard) {
      return player.actions[0].savedCard;
    } else {
      throw new Error('No hidden card to reveal');
    }
  }

  function getIsActionUndoable(G: GameState, id: string): boolean {
    const player = getPlayer(G, id);
    return Object.values(player.actions).some((action: Action) => action.enabled);
  }
</script>

{#if playerStage === 'acknowledgeOpponentChoice' || opponentStage === 'acknowledgeOpponentChoice'}
  <AcknowledgeChoice
    presentedCards={getPresentedCards(G, currentAction)}
    opponentChoice={getOpponentChoice(G)}
    {playerStage}
    {opponentStage}
    {currentAction}
    {acknowledgeChoice}
  />
{:else if playerStage === 'acknowledgeReveal' || opponentStage === 'acknowledgeReveal'}
  <AcknowledgeReveal
    revealedCard={getRevealedCard(G, playerStage, opponentStage)}
    {playerStage}
    {opponentStage}
    {currentAction}
    {acknowledgeReveal}
  />
{:else}
  <section aria-label="game-interface" class="grid grid-rows-[1fr_16.2vh_1fr]">
    <div aria-label="instruction" class="place-self-center max-w-prose h-full">
      {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
        <p class="text-3xl my-6">{instruction}</p>
      {/each}
    </div>
    <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
      {#if playerStage === 'draw' || opponentStage === 'draw'}
        <Deck handleClick={() => drawCard()} isDisabled={playerStage !== 'draw'} />
      {:else if playerStage === 'selectCardsAsCurrentPlayer'}
        <SelectedCardAreaActivePlayer {currentAction} {selectedCards} />
      {:else if playerStage === 'selectCardsAsOpposingPlayer'}
        <PresentedCardAreaActivePlayer
          {G}
          {currentAction}
          {selectedPresentedIndex}
          {selectFromPresented}
          {deselectFromPresented}
          {getPresentedCards}
        />
      {:else if opponentStage === 'selectCardsAsCurrentPlayer'}
        <SelectedCardAreaNonactivePlayer {currentAction} />
      {:else if opponentStage === 'selectCardsAsOpposingPlayer'}
        <PresentedCardAreaNonactivePlayer {G} {currentAction} {getPresentedCards} />
      {:else if playerStage === 'calculate'}
        <button
          on:click={() => calculateScore()}
          class="bg-violet-300 text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600"
        >
          calculate
      </button>
      {/if}
    </div>
    <div class="flex pt-10 justify-center gap-8">
      {#if playerStage === 'selectCardsAsCurrentPlayer' && getIsActionUndoable(G, playerID)}
        <button
          on:click={() => undoAction()}
          class="bg-gray-600 text-white text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600"
        >
          undo
        </button>
      {/if}
      {#if playerStage === 'selectCardsAsCurrentPlayer' || playerStage === 'selectCardsAsOpposingPlayer'}
        <button
          on:click={() => confirmSelection(selectedCards, selectedPresentedIndex)}
          disabled={getIsConfirmationButtonDisabled(selectedCards, selectedPresentedIndex)}
          class="bg-violet-300 text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:bg-gray-200 disabled:shadow-none"
        >
          confirm
        </button>
      {/if}
    </div>
  </section>
{/if}
