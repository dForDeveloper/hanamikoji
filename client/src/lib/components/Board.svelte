<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Action, GameState, GeishaCard, ItemCard } from 'game-logic';
  import type { Ctx } from 'boardgame.io';

  export let client: any;
  const playerID: string = client.playerID;
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let callToAction = '';
  let availableMove = '';

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      callToAction = getCallToAction();
      availableMove = getAvailableMove();
      console.log({ G, ctx, client });
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

  function getCallToAction(): string {
    const errorMessage = 'ERROR: No player has any available moves to make';
    if (ctx.activePlayers) {
      const playerStage: string | undefined = ctx.activePlayers[playerID];
      const opponentStage: string = ctx.activePlayers[opponentPlayerID];
      if (opponentStage) {
        switch (opponentStage) {
          case 'draw':
            return 'Waiting for opponent to draw a card'; 
          case 'selectAction':
            return 'Waiting for opponent to select an action';
          case 'selectCardsAsCurrentPlayer':
            return 'Waiting for opponent to select cards';
          case 'selectCardsAsOpposingPlayer':
            return 'Waiting for opponent to select cards';
          case 'reveal':
            return 'Opponent in reveal stage';
          case 'calculate':
            return 'Opponent in calculate stage';
          case 'prepareNextRound':
            return 'Opponent in prepareNextRound stage';
          default:
            return errorMessage;
        }
      } else if (playerStage) {
        switch (playerStage) {
          case 'draw':
            return 'Draw a card'; 
          case 'selectAction':
            return 'Select an action';
          case 'selectCardsAsCurrentPlayer':
            return 'Select cards';
          case 'selectCardsAsOpposingPlayer':
            return 'Select cards';
          case 'reveal':
            return 'reveal stage';
          case 'calculate':
            return 'calculate stage';
          case 'prepareNextRound':
            return 'prepareNextRound stage';
          default:
            return errorMessage;
        }
      } else {
        return errorMessage;
      }
    } else {
      return errorMessage;
    }
  }

  function getAvailableMove(): string {
    if (ctx.activePlayers && ctx.activePlayers[playerID]) {
      return ctx.activePlayers[playerID];
    } else {
      return '';
    }
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
    <section aria-label="game-interface">
      <p>{callToAction}</p>
      {#if availableMove === 'draw'}
        <button
          on:click={client.moves.draw()}
          class="bg-sky-500 hover:bg-sky-900 hover:cursor-pointer"
        >
          Draw a card
        </button>
      <!-- {:else if getAvailableMove() === 'selectAction'}
        {#each}

        {/each} -->
      {/if}
    </section>
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
        <button
          on:click={client.moves.selectAction(i.toString())}
          class="border-2 border-black aspect-square hover:cursor-pointer disabled:cursor-default"
          disabled={!action.enabled || availableMove !== 'selectAction'}
        >
          {`Action ${i + 1}`}
        </button>
      {/each}
    </section>
    <section aria-label="your-hand" class="grid grid-cols-7 gap-2 items-end">
      {#each G.players[playerID].hand as card}
        <div class="border-2 border-black aspect-[8/11]">
          <p>{card.color}</p>
          <p>{card.charmPoints}</p>
        </div>
      {/each}
    </section>
  </main>
{/if}
