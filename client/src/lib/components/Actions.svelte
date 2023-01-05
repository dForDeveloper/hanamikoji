<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import type { Player } from 'game-logic';

  export let player: Player;
  export let playerStage: string;
  export let selectAction: (actionIndex: string) => void;
</script>

<section aria-label="your-actions" class="flex flex-row justify-evenly space-x-2 items-end">
  {#each Object.values(player.actions) as action, i}
    <div class="relative aspect-[8/11] h-[16.2vh] grid items-end justify-center">
      {#if playerStage === 'selectAction'}
        <button
          on:click={() => selectAction(i.toString())}
          class="aspect-square aspect-square rounded-md h-[8vh] shadow-sm shadow-black"
          disabled={!action.enabled}
        >
          <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={action.enabled} />
        </button>
      {:else}
        <button class="aspect-square aspect-square rounded-md h-[8vh] shadow-sm shadow-black" disabled>
          <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
        </button>
      {/if}
      {#if action.savedCard}
        <div class="aspect-[8/11] h-[16.2vh] absolute -z-10">
          <Card type="item" color={action.savedCard.color} />
        </div>
      {/if}
      {#if action.discardedCards && action.discardedCards.length === 2}
        <div class="aspect-[8/11] h-[16.2vh] absolute -z-10 -translate-x-5">
          <Card type="item" color={action.discardedCards[0].color} />
        </div>
        <div class="aspect-[8/11] h-[16.2vh] absolute -z-10 translate-x-5">
          <Card type="item" color={action.discardedCards[1].color} />
        </div>
      {/if}
    </div>
  {/each}
</section>
