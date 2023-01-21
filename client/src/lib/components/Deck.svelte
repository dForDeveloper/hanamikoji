<script lang="ts">
  import Card from '$lib/components/Card.svelte';

  export let handleClick: () => void;
  export let isDisabled: boolean;
</script>

<div class="relative w-[11.53vh] xl:rounded-lg min-[1920px]:rounded-xl">
  <button on:click={handleClick} class={'absolute w-full z-50'} disabled={isDisabled}>
    <Card type="back" isHoverable={!isDisabled} backAlt={'top card of deck'} />
  </button>
  <div class={'absolute w-full z-40 top-1 scale-x-[0.99]'}>
    <Card type="back" backAlt={'card in deck'} />
  </div>
  <div class={'absolute w-full z-30 top-2 scale-x-[0.98]'}>
    <Card type="back" backAlt={'card in deck'} />
  </div>
  <div class={'absolute w-full z-20 top-3 scale-x-[0.97]'}>
    <Card type="back" backAlt={'card in deck'} />
  </div>
  <div class={'absolute w-full z-10 top-4 scale-x-[0.96]'}>
    <Card type="back" backAlt={'card in deck'} />
  </div>
</div>
