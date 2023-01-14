<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { getInstructions } from '$lib/instruction-messages';
  import type { ItemCard } from 'game-logic';

  export let presentedCards: ItemCard[];
  export let playerStage: string;
  export let opponentStage: string;
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
    {#if playerStage === 'acknowledgeOpponentChoice'}
      {#each getChoosingPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {:else if opponentStage === 'acknowledgeOpponentChoice'}
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
    {#if playerStage === 'acknowledgeOpponentChoice'}
      <button
        on:click={() => acknowledgeChoice()}
        class="bg-violet-300 text-xl h-12 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 place-self-center"
      >
        accept
      </button>
    {/if}
  </div>
  <div class="flex flex-row justify-center space-x-2 pt-2">
    {#if playerStage === 'acknowledgeOpponentChoice'}
      {#each getCurrentPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {:else if opponentStage === 'acknowledgeOpponentChoice'}
      {#each getChoosingPlayerCardsToAcknowledge(currentAction, opponentChoice, presentedCards) as card}
        <div class="h-[16.2vh] w-[11.53vh]">
          <Card type="item" color={card.color} />
        </div>
      {/each}
    {/if}
  </div>
</section>
