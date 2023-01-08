<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import type { ItemCard } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let playerStage: string;
  export let opponentStage: string;
  export let currentAction: string;
  export let presentedSelection: string;
  export let selectedCards: SelectedCard[];
  export let presentedCards: ItemCard[];
  export let drawCard: () => void;
  export let setPresentedSelection: (updatedPresentedSelection: string) => void;

  function getSelectedCardsToDisplay(currentAction: string, selectedCards: SelectedCard[]): SelectedCard[] {
    return selectedCards.slice(0, Number(currentAction) + 1);
  }

  function selectFromPresented(currentAction: string, i: number): void {
    if (currentAction === '2') {
      setPresentedSelection(i.toString());
    } else if (currentAction === '3') {
      if (i <= 1) setPresentedSelection('0');
      if (i >= 2) setPresentedSelection('1');
    }
  }

  function deselectFromPresented(): void {
    setPresentedSelection('');
  }
</script>

<div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
  {#if playerStage}
    {#if playerStage === 'draw'}
      <Deck handleClick={() => drawCard()} isDisabled={false} />
    {:else if playerStage === 'selectCardsAsCurrentPlayer'}
      <div class="flex flex-row justify-center space-x-2">
        {#each getSelectedCardsToDisplay(currentAction, selectedCards) as selectedCard, i}
          {#if currentAction === '3' && i === 2}
            <div class="h-[16.2vh] w-[11.53vh]" />
          {/if}
          <div class="h-[16.2vh] w-[11.53vh]">
            {#if selectedCard}
              <Card type="item" color={selectedCard.color} />
            {:else}
              <Card type="empty" />
            {/if}
          </div>
        {/each}
      </div>
    {:else if playerStage === 'selectCardsAsOpposingPlayer'}
      {#if currentAction === '2'}
        <div class="flex flex-row justify-center space-x-2">
          {#each presentedCards as card, i}
            {#if presentedSelection === i.toString()}
              <button on:click={() => deselectFromPresented()} class="h-[16.2vh] w-[11.53vh]">
                <Card type="item" color={card.color} isSelected={true} isHoverable={true} isInverted={true} />
              </button>
            {:else}
              <button on:click={() => selectFromPresented(currentAction, i)} class="h-[16.2vh] w-[11.53vh]">
                <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
              </button>
            {/if}
          {/each}
        </div>
      {:else if currentAction === '3'}
        <div class="flex flex-row justify-center space-x-2">
          <div class="flex flex-row justify-center space-x-2">
            {#each presentedCards as card, i}
              {#if currentAction === '3' && i === 2}
                <div class="h-[16.2vh] w-[11.53vh]" />
              {/if}
              {#if (i <= 1 && presentedSelection === '0') || (i >= 2 && presentedSelection === '1')}
                <button on:click={() => deselectFromPresented()} class="h-[16.2vh] w-[11.53vh]">
                  <Card type="item" color={card.color} isSelected={true} isHoverable={true} isInverted={true} />
                </button>
              {:else}
                <button on:click={() => selectFromPresented(currentAction, i)} class="h-[16.2vh] w-[11.53vh]">
                  <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  {:else if opponentStage}
    {#if opponentStage === 'draw'}
      <Deck handleClick={() => false} isDisabled={true} />
    {:else if opponentStage === 'selectCardsAsCurrentPlayer' || opponentStage === 'selectCardsAsOpposingPlayer'}
      <div class="flex flex-row justify-center space-x-2">
        {#if opponentStage === 'selectCardsAsCurrentPlayer'}
          {#each Array(Number(currentAction) + 1) as _, i}
            {#if currentAction === '3' && i === 2}
              <div class="h-[16.2vh] w-[11.53vh]" />
            {/if}
            <div class="h-[16.2vh] w-[11.53vh]">
              <Card type="empty" />
            </div>
          {/each}
        {:else if opponentStage === 'selectCardsAsOpposingPlayer'}
          {#each presentedCards as card, i}
            {#if currentAction === '3' && i === 2}
              <div class="h-[16.2vh] w-[11.53vh]" />
            {/if}
            <div class="h-[16.2vh] w-[11.53vh]">
              <Card type="item" color={card.color} />
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  {/if}
</div>
