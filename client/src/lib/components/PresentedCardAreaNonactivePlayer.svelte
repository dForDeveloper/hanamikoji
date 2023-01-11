<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { GameState, ItemCard } from 'game-logic';

  export let G: GameState;
  export let currentAction: string;
  export let getPresentedCards: (G: GameState, currentAction: string) => ItemCard[];
</script>

{#each getPresentedCards(G, currentAction) as card, i}
  {#if currentAction === '3' && i === 2}
    <div class="h-[16.2vh] w-[11.53vh]" />
  {/if}
  <div class="h-[16.2vh] w-[11.53vh]">
    <Card type="item" color={card.color} />
  </div>
{/each}
