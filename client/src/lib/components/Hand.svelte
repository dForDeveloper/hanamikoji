<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { GameState } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let G: GameState;
  export let playerID: string;
  export let availableMove: string;
  export let selectedCards: SelectedCard[];
  export let currentAction: string | null;
  export let setSelectedCards: (updatedSelectedCards: SelectedCard[]) => void;

  function getIsSelected(selectedCards: SelectedCard[], index: number): boolean {
    const maybeSelectedCard = selectedCards.find((maybeCard) => maybeCard && maybeCard.index === index);
    return maybeSelectedCard !== undefined;
  }

  function addCardToSelectedCards(selectedCard: SelectedCard, currentAction: string | null): void {
    if (currentAction === '0') {
      setSelectedCards([selectedCard, null, null, null]);
    } else {
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      const enoughCardsHaveNotBeenSelected = nonNullSelectedCardCount <= Number(currentAction);

      const maybeFirstNullIndex = selectedCards.findIndex((maybeCard) => maybeCard === null);
      const theFirstOpenSpotIsValid = maybeFirstNullIndex !== -1 && maybeFirstNullIndex <= Number(currentAction);

      if (enoughCardsHaveNotBeenSelected && theFirstOpenSpotIsValid) {
        const updatedSelectedCards = selectedCards.map((maybeCard, i) => {
          if (i === maybeFirstNullIndex) return selectedCard;
          return maybeCard;
        });
        setSelectedCards(updatedSelectedCards);
      }
    }
  }

  function removeCardFromSelectedCards(selectedCards: SelectedCard[], indexToRemove: number): void {
    const updatedSelectedCards = selectedCards.map((maybeCard) => {
      if (maybeCard && maybeCard.index === indexToRemove) return null;
      return maybeCard;
    });
    setSelectedCards(updatedSelectedCards);
  }
</script>

<section aria-label="your-hand" class="flex flex-row justify-center space-x-2">
  {#each G.players[playerID].hand as card, index}
    {#if availableMove === 'selectCardsAsCurrentPlayer'}
      {#if getIsSelected(selectedCards, index)}
        <button on:click={() => removeCardFromSelectedCards(selectedCards, index)} class="aspect-[8/11] h-[16.2vh]">
          <Card type="item" color={card.color} isSelected={true} isHoverable={true} />
        </button>
      {:else}
        <button
          on:click={() => addCardToSelectedCards({ ...card, index }, currentAction)}
          class="aspect-[8/11] h-[16.2vh]"
        >
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
