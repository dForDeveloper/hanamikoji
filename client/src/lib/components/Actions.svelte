<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import { Stage } from 'game-logic';
  import type { Player } from 'game-logic';

  export let player: Player;
  export let playerStage: Stage;
  export let selectAction: (actionIndex: string) => void;
  export let revealHiddenCard: () => void;
</script>

<section aria-label="your-actions" class="flex flex-row justify-evenly space-x-2 items-end">
  {#each Object.values(player.actions) as action, i}
    <div class="relative h-item-card w-item-card grid items-end justify-center">
      {#if playerStage === Stage.SELECT_ACTION}
        <button
          on:click={() => selectAction(i.toString())}
          class="hw-action shadow-sm shadow-black z-10 rounded 2xl:rounded-md"
          disabled={!action.enabled}
        >
          <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={action.enabled} />
        </button>
      {:else}
        <button class="hw-action shadow-sm shadow-black z-10 rounded 2xl:rounded-md" disabled>
          <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
        </button>
      {/if}
      {#if action.savedCard}
        {#if playerStage === 'reveal'}
          <button on:click={() => revealHiddenCard()} class="h-item-card w-item-card absolute hover:cursor-pointer">
            <Card type="item" color={action.savedCard.color} isHoverable={true} />
          </button>
        {:else}
          <div class="h-item-card w-item-card absolute">
            <Card type="item" color={action.savedCard.color} />
          </div>
        {/if}
      {/if}
      {#if action.discardedCards && action.discardedCards.length === 2}
        <div class="h-item-card w-item-card absolute lg:-translate-x-2 xl:-translate-x-5">
          <Card type="item" color={action.discardedCards[0].color} />
        </div>
        <div class="h-item-card w-item-card absolute lg:translate-x-2 xl:translate-x-5">
          <Card type="item" color={action.discardedCards[1].color} />
        </div>
      {/if}
    </div>
  {/each}
</section>
