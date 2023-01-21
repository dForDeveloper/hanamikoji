<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { SelectedCard } from '$lib/types';

  export let currentAction: string;
  export let selectedCards: SelectedCard[];

  function getSelectedCardsToDisplay(currentAction: string, selectedCards: SelectedCard[]): SelectedCard[] {
    return selectedCards.slice(0, Number(currentAction) + 1);
  }
</script>

{#each getSelectedCardsToDisplay(currentAction, selectedCards) as selectedCard, i}
  {#if currentAction === '3' && i === 2}
    <div class="h-item-card w-item-card" />
  {/if}
  <div class="h-item-card w-item-card">
    {#if selectedCard}
      <Card type="item" color={selectedCard.color} />
    {:else}
      <Card type="empty" />
    {/if}
  </div>
{/each}
