<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { Stage } from 'game-logic';
  import type { Player } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let player: Player;
  export let hasGameStarted: boolean;
  export let playerStage: Stage;
  export let selectedCards: SelectedCard[];
  export let currentAction: string | null;
  export let setSelectedCardsFromHand: (updatedSelectedCards: SelectedCard[]) => void;

  function getIsSelectedFromHand(selectedCards: SelectedCard[], index: number): boolean {
    const maybeSelectedCard = selectedCards.find((maybeCard) => maybeCard && maybeCard.index === index);
    return maybeSelectedCard !== undefined;
  }

  function selectCardFromHand(selectedCard: SelectedCard, currentAction: string | null): void {
    if (currentAction === '0') {
      setSelectedCardsFromHand([selectedCard, null, null, null]);
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
        setSelectedCardsFromHand(updatedSelectedCards);
      }
    }
  }

  function deselectCardFromHand(selectedCards: SelectedCard[], indexToRemove: number): void {
    const updatedSelectedCards = selectedCards.map((maybeCard) => {
      if (maybeCard && maybeCard.index === indexToRemove) return null;
      return maybeCard;
    });
    setSelectedCardsFromHand(updatedSelectedCards);
  }
</script>

{#if hasGameStarted}
  <section aria-label="your-hand" class="flex flex-row justify-center space-x-2">
    {#each player.hand as card, index}
      {#if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER}
        {#if getIsSelectedFromHand(selectedCards, index)}
          <button on:click={() => deselectCardFromHand(selectedCards, index)} class="h-[16.2vh] w-[11.53vh]">
            <Card type="item" color={card.color} isSelected={true} isHoverable={true} />
          </button>
        {:else}
          <button on:click={() => selectCardFromHand({ ...card, index }, currentAction)} class="h-[16.2vh] w-[11.53vh]">
            <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
          </button>
        {/if}
      {:else}
        <button disabled class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} isSelected={false} isHoverable={false} />
        </button>
      {/if}
    {/each}
  </section>
{/if}
