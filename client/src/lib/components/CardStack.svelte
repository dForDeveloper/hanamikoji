<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { Color } from 'game-logic';

  export let color: Color;
  export let count: number;
  export let isUpsideDown = false;

  function composeParentClasses(count: number, isUpsideDown: boolean): string {
    let cssClasses = 'relative w-geisha-card pt-2 flex justify-center';
    if (count === 1) {
      cssClasses = cssClasses + ' lg:justify-center';
    } else {
      cssClasses = cssClasses + ' lg:justify-start';
    }
    if (isUpsideDown) {
      cssClasses = cssClasses + ' rotate-180';
    }
    return cssClasses;
  }

  function composeChildClasses(count: number, index: number): string {
    const defaultClasses = 'absolute rounded xl:rounded-lg fhd:rounded-xl';
    const zIndex = ' z-' + ((index + 1) * 10).toString();
    return defaultClasses + zIndex + getAbsolutePositions(count)[index];
  }

  function getAbsolutePositions(count: number): string[] {
    switch (count) {
      case 1:
        return [''];
      case 2:
        return ['', ' top-9 lg:left-2 xl:left-3 fhd:left-4'];
      case 3:
        return ['', ' top-[1.3rem] lg:left-1 xl:left-1.5 fhd:left-2', ' top-9 lg:left-2 xl:left-3 fhd:left-4'];
      case 4:
        return [
          '',
          ' top-4 lg:left-[0.2rem] xl:left-1 fhd:left-1.5',
          ' top-[1.6rem] lg:left-[0.4rem] xl:left-2 fhd:left-3',
          ' top-9 lg:left-[0.6rem] xl:left-3 fhd:left-[1.125rem]',
        ];
      case 5:
        return [
          '',
          ' top-[0.9rem] lg:left-0.5 fhd:left-1',
          ' top-[1.35rem] lg:left-1 fhd:left-2',
          ' top-[1.8rem] lg:left-1.5 fhd:left-3',
          ' top-9 lg:left-2 fhd:left-4',
        ];
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
