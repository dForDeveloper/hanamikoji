<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import CardStack from '$lib/components/CardStack.svelte';
  import type { GeishaCard } from 'game-logic';

  export let geishaCards: GeishaCard[];
  export let playerID: string;
  export let opponentID: string;

  function getVictoryMarkerDirection(favoredPlayerID: number | null, playerID: string, opponentID: string): number {
    if (favoredPlayerID === Number(playerID)) {
      return 1;
    } else if (favoredPlayerID === Number(opponentID)) {
      return -1;
    } else {
      return 0;
    }
  }
</script>

<section aria-label="game-board" class="grid grid-rows-[1fr_20vh_1fr]">
  <div aria-label="opponent-played-cards" class="flex flex-row justify-center space-x-4">
    {#each geishaCards as geishaCard}
      <CardStack color={geishaCard.color} count={geishaCard.playerItemCards[opponentID].length} isUpsideDown={true} />
    {/each}
  </div>
  <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-4">
    {#each geishaCards as geishaCard}
      <div>
        <Card
          type="geisha"
          color={geishaCard.color}
          victoryMarkerDirection={getVictoryMarkerDirection(geishaCard.favoredPlayerID, playerID, opponentID)}
        />
      </div>
    {/each}
  </div>
  <div aria-label="your-played-cards" class="flex flex-row justify-center space-x-4">
    {#each geishaCards as geishaCard}
      <CardStack color={geishaCard.color} count={geishaCard.playerItemCards[playerID].length} />
    {/each}
  </div>
</section>
