<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Action, GameState, GeishaCard, ItemCard } from 'game-logic';
  import type { Ctx } from 'boardgame.io';

  export let client: any;
  const playerID: string = client.playerID;
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;

  const unsubscribe = client.subscribe((gameState: any) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      console.log('G', G);
      console.log('ctx', ctx);
      console.log('client', client);
    } else {
      throw new Error('Error syncing game state');
    }
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    client.stop();
  });

  function getActions(playerID: string): Action[] {
    return Object.values(G.players[playerID].actions);
  }

  function getHand(playerID: string): ItemCard[] {
    return G.players[playerID].hand;
  }

  function getGeishaCards(): GeishaCard[] {
    return Object.values(G.geisha);
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[3fr_7fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2">
    <section aria-label="opponent-actions" class="grid grid-cols-4 gap-2">
      {#each getActions(opponentPlayerID) as action, i}
        <div class="border-2 border-black aspect-square">
          {`Action ${i + 1}`}
        </div>
      {/each}
    </section>
    <section aria-label="opponent-hand" class="grid grid-cols-7 gap-2">
      {#each getHand(opponentPlayerID) as card}
        <div class="border-2 border-black aspect-[8/11]">
          <p>{card.color}</p>
          <p>{card.charmPoints}</p>
        </div>
      {/each}
    </section>
    <section aria-label="game-interface">Main Area</section>
    <section aria-label="game-board" class="grid grid-cols-7 gap-2 items-center">
      {#each getGeishaCards() as geishaCard}
        <div class="border-2 border-black aspect-[2/3]">
          <p>{geishaCard.color}</p>
          <p>{geishaCard.charmPoints}</p>
          <p>{geishaCard.favoredPlayerID}</p>
          <p>Opponent Cards: {geishaCard.playerItemCards[opponentPlayerID].length}</p>
          <p>Your Cards: {geishaCard.playerItemCards[playerID].length}</p>
        </div>
      {/each}
    </section>
    <section aria-label="your-actions" class="grid grid-cols-4 gap-2 items-end">
      {#each getActions(playerID) as action, i}
        <div class="border-2 border-black aspect-square">
          {`Action ${i + 1}`}
        </div>
      {/each}
    </section>
    <section aria-label="your-hand" class="grid grid-cols-7 gap-2 items-end">
      {#each getHand(playerID) as card}
        <div class="border-2 border-black aspect-[8/11]">
          <p>{card.color}</p>
          <p>{card.charmPoints}</p>
        </div>
      {/each}
    </section>
  </main>
{/if}
