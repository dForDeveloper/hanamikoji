<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import CardStack from '$lib/components/CardStack.svelte';
  import type { GameState, GeishaCard, Player } from 'game-logic';

  export let geishaCards: GeishaCard[];
  export let playerID: string;
  export let opponentPlayerID: string;
</script>

<section aria-label="game-board" class="grid grid-rows-[1fr_20vh_1fr]">
  <div aria-label="opponent-played-cards" class="flex flex-row justify-center space-x-4">
    {#each geishaCards as geishaCard}
      <CardStack
        color={geishaCard.color}
        count={geishaCard.playerItemCards[opponentPlayerID].length}
        isFlipped={true}
      />
    {/each}
  </div>
  <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-4">
    {#each geishaCards as geishaCard}
      <div>
        <Card type="geisha" color={geishaCard.color} />
      </div>
    {/each}
  </div>
  <div aria-label="your-played-cards" class="flex flex-row justify-center space-x-4">
    {#each geishaCards as geishaCard}
      <CardStack color={geishaCard.color} count={geishaCard.playerItemCards[playerID].length} />
    {/each}
  </div>
</section>