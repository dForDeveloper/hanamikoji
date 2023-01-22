<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { ItemCard } from 'game-logic';

  export let presentedCards: ItemCard[];
  export let currentAction: string;
  export let selectedFromPresented: string;
  export let setSelectedFromPresented: (updatedPresentedSelection: string) => void;

  function selectFromPresented(currentAction: string, i: number): void {
    if (currentAction === '2') {
      setSelectedFromPresented(i.toString());
    } else if (currentAction === '3') {
      if (i <= 1) setSelectedFromPresented('0');
      if (i >= 2) setSelectedFromPresented('1');
    }
  }

  function deselectFromPresented(): void {
    setSelectedFromPresented('');
  }
</script>

{#if currentAction === '2'}
  {#each presentedCards as card, i}
    {#if selectedFromPresented === i.toString()}
      <button on:click={() => deselectFromPresented()} class="h-item-card w-item-card">
        <Card type="item" color={card.color} isSelected={true} isHoverable={true} isTranslatedDown={true} />
      </button>
    {:else}
      <button on:click={() => selectFromPresented(currentAction, i)} class="h-item-card w-item-card">
        <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
      </button>
    {/if}
  {/each}
{:else if currentAction === '3'}
  {#each presentedCards as card, i}
    {#if currentAction === '3' && i === 2}
      <div class="h-item-card lg:w-[1.5vh] xl:w-[3.5vh] 2xl:w-[5.5vh] fhd:w-item-card" />
    {/if}
    {#if (i <= 1 && selectedFromPresented === '0') || (i >= 2 && selectedFromPresented === '1')}
      <button on:click={() => deselectFromPresented()} class="h-item-card w-item-card">
        <Card type="item" color={card.color} isSelected={true} isHoverable={true} isTranslatedDown={true} />
      </button>
    {:else}
      <button on:click={() => selectFromPresented(currentAction, i)} class="h-item-card w-item-card">
        <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
      </button>
    {/if}
  {/each}
{/if}
