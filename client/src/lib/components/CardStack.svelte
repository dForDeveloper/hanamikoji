<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { Color } from 'game-logic';

  export let color: Color;
  export let count: number;
  export let isUpsideDown = false;

  function composeParentClasses(count: number, isUpsideDown: boolean): string {
    let cssClasses = 'relative w-[13.31vh] pt-2';
    if (count === 1) {
      cssClasses = cssClasses + ' flex justify-center';
    }
    if (isUpsideDown) {
      cssClasses = cssClasses + ' rotate-180';
    }
    return cssClasses;
  }

  function composeChildClasses(count: number, index: number): string {
    const defaultClasses = 'absolute xl:rounded-lg fhd:rounded-xl';
    const zIndex = ' z-' + ((index + 1) * 10).toString();
    return defaultClasses + zIndex + getAbsolutePositions(count)[index];
  }

  function getAbsolutePositions(count: number): string[] {
    switch (count) {
      case 1:
        return [''];
      case 2:
        return ['', ' top-9 left-4'];
      case 3:
        return ['', ' top-[1.3rem] left-2', ' top-9 left-4'];
      case 4:
        return ['', ' top-4 left-1.5', ' top-[1.6rem] left-3', ' top-9 left-[1.125rem]'];
      case 5:
        return ['', ' top-[0.9rem] left-1', ' top-[1.35rem] left-2', ' top-[1.8rem] left-3', ' top-9 left-4'];
      default:
        return [''];
    }
  }
</script>

<div class={composeParentClasses(count, isUpsideDown)}>
  {#each Array(count) as _, i}
    <div class={composeChildClasses(count, i)}>
      <Card type="item" {color} {isUpsideDown} />
    </div>
  {/each}
</div>
