<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { getInstructions } from '$lib/instruction-messages';
  import { Stage } from 'game-logic';
  import type { ItemCard } from 'game-logic';

  export let presentedCards: ItemCard[];
  export let playerStage: Stage;
  export let opponentStage: Stage;
  export let currentAction: string;
  export let opponentChoice: string;
  export let acknowledgeChoice: () => void;

  function getChoosingPlayerCardsToAcknowledge(
    currentAction: string,
    opponentChoice: string,
    presentedCards: ItemCard[],
  ): ItemCard[] {
    if (currentAction === '2') {
      return presentedCards.filter((card, i) => i === Number(opponentChoice));
    } else if (currentAction === '3') {
      return opponentChoice === '0' ? presentedCards.slice(0, 2) : presentedCards.slice(2, 4);
    } else {
      throw new Error('Cards to acknowledge should not exist');
    }
  }

  function getCurrentPlayerCardsToAcknowledge(
    currentAction: string,
    opponentChoice: string,
    presentedCards: ItemCard[],
  ): ItemCard[] {
    if (currentAction === '2') {
      return presentedCards.filter((card, i) => i !== Number(opponentChoice));
    } else if (currentAction === '3') {
      return opponentChoice === '0' ? presentedCards.slice(2, 4) : presentedCards.slice(0, 2);
    } else {
      throw new Error('Cards to acknowledge should not exist');
    }
  }
</script>

<section aria-label="game-interface" class="grid grid-rows-[1fr_20vh_1fr]">
  <div class="flex flex-row justify-center space-x-2 items-end pb-2">
    {#if playerStage === Stage.ACKNOWLEDGE_CHOICE}
      {#each getChoosingPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {:else if opponentStage === Stage.ACKNOWLEDGE_CHOICE}
      {#each getCurrentPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {/if}
  </div>
  <div aria-label="instruction" class="flex flex-col place-self-center max-w-prose justify-content-center">
    {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
      <p class="text-3xl my-6">{instruction}</p>
    {/each}
    {#if playerStage === Stage.ACKNOWLEDGE_CHOICE}
      <Button handleClick={acknowledgeChoice} extraClasses="place-self-center">accept</Button>
    {/if}
  </div>
  <div class="flex flex-row justify-center space-x-2 pt-2">
    {#if playerStage === Stage.ACKNOWLEDGE_CHOICE}
      {#each getCurrentPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {:else if opponentStage === Stage.ACKNOWLEDGE_CHOICE}
      {#each getChoosingPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {/if}
  </div>
</section>
