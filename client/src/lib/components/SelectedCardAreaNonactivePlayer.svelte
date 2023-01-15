<script lang="ts">
  import Card from '$lib/components/Card.svelte';

  export let currentAction: string;
</script>

{#each Array(Number(currentAction) + 1) as _, i}
  {#if currentAction === '3' && i === 2}
    <div class="h-[16.2vh] w-[11.53vh]" />
  {/if}
  <div class="h-[16.2vh] w-[11.53vh]">
    <Card type="empty" />
  </div>
{/each}
