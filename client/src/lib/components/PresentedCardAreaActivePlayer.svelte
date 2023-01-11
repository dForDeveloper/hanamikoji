<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { GameState, ItemCard } from 'game-logic';

  export let G: GameState;
  export let currentAction: string;
  export let selectedPresentedIndex: string;
  export let selectFromPresented: (currentAction: string, i: number) => void;
  export let deselectFromPresented: () => void;
  export let getPresentedCards: (G: GameState, currentAction: string) => ItemCard[];
</script>

{#if currentAction === '2'}
  {#each getPresentedCards(G, currentAction) as card, i}
    {#if selectedPresentedIndex === i.toString()}
      <button on:click={() => deselectFromPresented()} class="h-[16.2vh] w-[11.53vh]">
        <Card type="item" color={card.color} isSelected={true} isHoverable={true} isInverted={true} />
      </button>
    {:else}
      <button on:click={() => selectFromPresented(currentAction, i)} class="h-[16.2vh] w-[11.53vh]">
        <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
      </button>
    {/if}
  {/each}
{:else if currentAction === '3'}
  {#each getPresentedCards(G, currentAction) as card, i}
    {#if currentAction === '3' && i === 2}
      <div class="h-[16.2vh] w-[11.53vh]" />
    {/if}
    {#if (i <= 1 && selectedPresentedIndex === '0') || (i >= 2 && selectedPresentedIndex === '1')}
      <button on:click={() => deselectFromPresented()} class="h-[16.2vh] w-[11.53vh]">
        <Card type="item" color={card.color} isSelected={true} isHoverable={true} isInverted={true} />
      </button>
    {:else}
      <button on:click={() => selectFromPresented(currentAction, i)} class="h-[16.2vh] w-[11.53vh]">
        <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
      </button>
    {/if}
  {/each}
{/if}
