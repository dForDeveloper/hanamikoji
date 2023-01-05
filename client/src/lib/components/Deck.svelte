<script lang="ts">
  import Card from '$lib/components/Card.svelte';

  export let handleClick: () => void;
  export let isDisabled: boolean;

  const sharedClasses = isDisabled ? 'absolute w-full grayscale' : 'absolute w-full';
</script>

<div class="relative aspect-[8/11] rounded-xl">
  <button on:click={handleClick} class={`${sharedClasses} z-50`} disabled={isDisabled}>
    <Card type="back" isHoverable={!isDisabled} />
  </button>
  <div class={`${sharedClasses} z-40 top-1 scale-x-[0.99]`}>
    <Card type="back" />
  </div>
  <div class={`${sharedClasses} z-30 top-2 scale-x-[0.98]`}>
    <Card type="back" />
  </div>
  <div class={`${sharedClasses} z-20 top-3 scale-x-[0.97]`}>
    <Card type="back" />
  </div>
  <div class={`${sharedClasses} z-10 top-4 scale-x-[0.96]`}>
    <Card type="back" />
  </div>
</div>
