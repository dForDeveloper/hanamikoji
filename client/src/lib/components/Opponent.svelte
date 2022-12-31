<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import type { Action, ItemCard } from 'game-logic';

  export let actions: Action[];
  export let hand: ItemCard[];
</script>

<section aria-label="opponent-actions" class="flex flex-row justify-evenly space-x-2">
  {#each actions as action, i}
    <div class="relative aspect-[8/11] h-full grid items-end justify-center">
      <div class="aspect-square disabled:cursor-default aspect-square rounded-md h-[8vh] shadow-sm shadow-black">
        <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
      </div>
      {#if action.savedCard}
        <div class="aspect-[8/11] absolute -z-10">
          <Card type="back" />
        </div>
      {/if}
    </div>
  {/each}
</section>
<section aria-label="opponent-hand" class="flex flex-row justify-center space-x-2">
  {#each hand as card}
    <div class="aspect-[8/11]">
      <Card type="back" />
    </div>
  {/each}
</section>
