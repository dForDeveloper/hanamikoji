<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { Stage } from 'game-logic';
  import { getInstructions } from '$lib/instruction-messages';
  import type { ItemCard } from 'game-logic';

  export let revealedCard: ItemCard;
  export let playerStage: Stage;
  export let opponentStage: Stage;
  export let currentAction: string;
  export let acknowledgeReveal: () => void;
</script>

<section
  aria-label="game-interface"
  class="grid h-screen lg:h-auto lg:grid-rows-[1fr_17vh_1fr] xl:grid-rows-[1fr_20vh_1fr]"
>
  <div class="flex flex-row justify-center space-x-2 items-end pb-2">
    {#if playerStage === Stage.ACKNOWLEDGE_REVEAL}
      <div class="h-item-card w-item-card">
        <Card type="item" color={revealedCard.color} />
      </div>
    {/if}
  </div>
  <div aria-label="instruction" class="flex flex-col place-self-center max-w-prose justify-content-center">
    {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
      <p class="message-text">{instruction}</p>
    {/each}
    {#if playerStage === Stage.ACKNOWLEDGE_REVEAL}
      <Button handleClick={acknowledgeReveal} extraClasses="place-self-center">accept</Button>
    {/if}
  </div>
  <div class="flex flex-row justify-center space-x-2 pt-2">
    {#if opponentStage === Stage.ACKNOWLEDGE_REVEAL}
      <div class="h-item-card w-item-card">
        <Card type="item" color={revealedCard.color} />
      </div>
    {/if}
  </div>
</section>
