<script lang="ts">
  import Card from '$lib/components/Card.svelte';

  export let handleClick: () => void;
</script>

<div class="relative aspect-[8/11] h-full rounded-xl">
  <button on:click={handleClick} class="absolute z-50">
    <Card type="back" isHoverable={true} />
  </button>
  <div class="absolute z-40 top-1 scale-x-[0.99]">
    <Card type="back" />
  </div>
  <div class="absolute z-30 top-2 scale-x-[0.98]">
    <Card type="back" />
  </div>
  <div class="absolute z-20 top-3 scale-x-[0.97]">
    <Card type="back" />
  </div>
  <div class="absolute z-10 top-4 scale-x-[0.96]">
    <Card type="back" />
  </div>
</div>
