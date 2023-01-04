<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { GameState, ItemCard } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let G: GameState;
  export let playerID: string;
  export let availableMove: string;
  export let selectedCards: SelectedCard[];
  export let getHand: (G: GameState, playerID: string) => ItemCard[];
  export let removeCardFromSelectedCards: (index: number) => void;
  export let addCardToSelectedCards: (selectedCard: SelectedCard) => void;

  function getIsSelected(selectedCards: SelectedCard[], index: number): boolean {
    const maybeSelectedCard = selectedCards.find((maybeCard) => maybeCard && maybeCard.index === index);
    return maybeSelectedCard !== undefined;
  }
</script>

<section aria-label="your-hand" class="flex flex-row justify-center space-x-2">
  {#each getHand(G, playerID) as card, index}
    {#if availableMove === 'selectCardsAsCurrentPlayer'}
      {#if getIsSelected(selectedCards, index)}
        <button on:click={() => removeCardFromSelectedCards(index)} class="aspect-[8/11] h-[16.2vh]">
          <Card type="item" color={card.color} isSelected={true} isHoverable={true} />
        </button>
      {:else}
        <button on:click={() => addCardToSelectedCards({ ...card, index })} class="aspect-[8/11] h-[16.2vh]">
          <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
        </button>
      {/if}
    {:else}
      <button disabled class="aspect-[8/11] h-[16.2vh]">
        <Card type="item" color={card.color} isSelected={false} isHoverable={false} />
      </button>
    {/if}
  {/each}
</section>
