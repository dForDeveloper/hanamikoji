<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import type { Player } from 'game-logic';

  export let player: Player;
</script>

<section aria-label="opponent-actions" class="flex flex-row justify-evenly space-x-2">
  {#each Object.values(player.actions) as action, i}
    <div class="relative h-[16.2vh] w-[11.53vh] grid items-start justify-center">
      <div class="rounded-md h-[8vh] w-[8vh] shadow-sm shadow-black">
        <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
      </div>
      {#if action.savedCard}
        <div class="h-[16.2vh] w-[11.53vh] absolute -z-10">
          <Card type="back" />
        </div>
      {/if}
      {#if action.discardedCards && action.discardedCards.length === 2}
        <div class="h-[16.2vh] w-[11.53vh] absolute -z-10 -translate-x-5">
          <Card type="back" />
        </div>
        <div class="h-[16.2vh] w-[11.53vh] absolute -z-10 translate-x-5">
          <Card type="back" />
        </div>
      {/if}
    </div>
  {/each}
</section>
<section aria-label="opponent-hand" class="flex flex-row justify-center space-x-2">
  {#each player.hand as _}
    <div class="h-[16.2vh] w-[11.53vh]">
      <Card type="back" />
    </div>
  {/each}
</section>
