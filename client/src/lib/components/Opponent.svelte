<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import type { Player } from 'game-logic';

  export let player: Player;
  export let hasGameStarted: boolean;
</script>

<section aria-label="opponent-actions" class="hidden lg:flex flex-row justify-evenly space-x-2">
  {#each Object.values(player.actions) as action, i}
    <div class="relative h-item-card w-item-card grid items-start justify-center">
      <div class="h-[8vh] w-[8vh] z-10 shadow-sm shadow-black rounded xl:rounded-lg 2xl:rounded-md">
        <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
      </div>
      {#if action.savedCard}
        <div class="h-item-card w-item-card absolute">
          <Card type="back" />
        </div>
      {/if}
      {#if action.discardedCards && action.discardedCards.length === 2}
        <div class="h-item-card w-item-card absolute -translate-x-5">
          <Card type="back" />
        </div>
        <div class="h-item-card w-item-card absolute translate-x-5">
          <Card type="back" />
        </div>
      {/if}
    </div>
  {/each}
</section>
<section aria-label="opponent-hand" class="hidden lg:flex flex-row justify-center space-x-2">
  {#if hasGameStarted}
    {#each player.hand as _}
      <div class="h-item-card w-item-card">
        <Card type="back" />
      </div>
    {/each}
  {/if}
</section>
