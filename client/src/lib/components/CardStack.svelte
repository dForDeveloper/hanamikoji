<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import type { Color } from 'game-logic';

  export let color: Color;
  export let count: number;
  export let isFlipped = false;

  function getFlippedClasses(isFlipped: boolean): string {
    return isFlipped ? 'rotate-180' : '';
  }
</script>

{#if count === 0}
  <div class="w-[13.31vh]" />
{:else if count === 1}
  <div class={`relative w-[13.31vh] pt-2 flex justify-center ${getFlippedClasses(isFlipped)}`}>
    <div class="rounded-xl absolute z-10">
      <Card type="item" {color} />
    </div>
  </div>
{:else if count === 2}
  <div class={`relative w-[13.31vh] pt-2 ${getFlippedClasses(isFlipped)}`}>
    <div class="rounded-xl absolute z-10">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-20 top-9 left-4">
      <Card type="item" {color} />
    </div>
  </div>
{:else if count === 3}
  <div class={`relative w-[13.31vh] pt-2 ${getFlippedClasses(isFlipped)}`}>
    <div class="rounded-xl absolute z-10">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-20 top-[1.125rem] left-2">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-30 top-9 left-4">
      <Card type="item" {color} />
    </div>
  </div>
{:else if count === 4}
  <div class={`relative w-[13.31vh] pt-2 ${getFlippedClasses(isFlipped)}`}>
    <div class="rounded-xl absolute z-10">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-20 top-3 left-1.5">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-30 top-6 left-3">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-40 top-9 left-[1.125rem]">
      <Card type="item" {color} />
    </div>
  </div>
{:else if count === 5}
  <div class={`relative w-[13.31vh] pt-2 ${getFlippedClasses(isFlipped)}`}>
    <div class="rounded-xl absolute z-10">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-20 top-[0.5625rem] left-1">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-30 top-[1.125rem] left-2">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-40 top-[1.6875rem] left-3">
      <Card type="item" {color} />
    </div>
    <div class="rounded-xl absolute z-50 top-9 left-4">
      <Card type="item" {color} />
    </div>
  </div>
{/if}
