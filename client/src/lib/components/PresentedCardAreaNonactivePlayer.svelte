<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { GameState, ItemCard } from 'game-logic';

  export let G: GameState;
  export let currentAction: string;
  export let getPresentedCards: (G: GameState, currentAction: string) => ItemCard[];
</script>

{#each getPresentedCards(G, currentAction) as card, i}
  {#if currentAction === '3' && i === 2}
    <div class="h-item-card lg:w-[1.5vh] xl:w-[3.5vh] 2xl:w-[5.5vh] fhd:w-item-card" />
  {/if}
  <div class="h-item-card w-item-card">
    <Card type="item" color={card.color} />
  </div>
{/each}
