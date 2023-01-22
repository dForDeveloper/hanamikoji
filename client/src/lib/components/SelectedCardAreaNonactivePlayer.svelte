<script lang="ts">
  import Card from '$lib/components/Card.svelte';

  export let currentAction: string;
</script>

{#each Array(Number(currentAction) + 1) as _, i}
  {#if currentAction === '3' && i === 2}
    <div class="h-item-card lg:w-[1.5vh] xl:w-[3.5vh] 2xl:w-[5.5vh] fhd:w-item-card" />
  {/if}
  <div class="h-item-card w-item-card">
    <Card type="empty" />
  </div>
{/each}
