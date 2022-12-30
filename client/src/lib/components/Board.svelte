<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { onDestroy } from 'svelte';
  import type { Action, GameState, GeishaCard, ItemCard } from 'game-logic';
  import type { Ctx } from 'boardgame.io';

  export let client: any;
  const playerID: string = client.playerID;
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let instruction = '';
  let availableMove = '';
  let currentAction: string | null = null;

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction;
      instruction = getInstruction();
      availableMove = getAvailableMove();
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

  function getInstruction(): string {
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
            return "It's the start of your turn. Draw a card.";
          case 'selectAction':
            return 'Select an action';
          case 'selectCardsAsCurrentPlayer':
            switch (currentAction) {
              case '0':
                return 'Choose 1 card from your hand. This card will be placed face down. Then it will be revealed and scored at the end of the round.';
              case '1':
                return 'Choose 2 cards from your hand. These cards will be placed face down and will not be scored this round.';
              case '2':
                return 'Choose 3 cards from your hand. These cards will be presented to your opponent. Your opponent will choose 1 of the cards to score for themself. You will score the remaining 2 cards.';
              case '3':
                return 'Choose 4 cards from your hand, and divide them into 2 pairs. These pairs will be presented to your opponent. Your opponent will choose 1 pair to score for themself. You will score the remaining pair.';
              default:
                return errorMessage;
            }
          case 'selectCardsAsOpposingPlayer':
            switch (currentAction) {
              case '2':
                return 'Your opponent chose to present these 3 cards. Choose 1 of these cards to score for yourself. They will score the remaining 2 cards.';
              case '3':
                return 'Your opponent chose to present these 2 pairs of cards. Choose 1 pair to score for yourself. They will score the remaining pair.';
              default:
                return errorMessage;
            }
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
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2">
    <section aria-label="opponent-actions" class="flex flex-row justify-evenly space-x-2">
      {#each getActions(opponentPlayerID) as action, i}
        <div class="border-2 border-black aspect-square h-[33%]">
          {`Action ${i + 1}`}
        </div>
      {/each}
    </section>
    <section aria-label="opponent-hand" class="flex flex-row justify-center space-x-2">
      {#each getHand(opponentPlayerID) as card}
        <div class="aspect-[8/11]">
          <Card type= 'item' color={card.color} /> 
        </div>
      {/each}
    </section>
    <section aria-label="game-interface" class="grid grid-rows-[75fr_50fr_75fr]">
      <div aria-label="instruction">
      <p>{instruction}</p>
      {#if availableMove === 'draw'}
          <button on:click={client.moves.draw()} class="bg-sky-500 hover:bg-sky-900 hover:cursor-pointer">
          Draw a card
        </button>
      <!-- {:else if getAvailableMove() === 'selectAction'}
        {#each}

        {/each} -->
      {/if}
    </section>
    <section aria-label="game-board" class="grid grid-rows-[11fr_10fr_11fr]">
      <div aria-label="opponent-played-cards"></div>
      <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-2 h-full">
        {#each getGeishaCards() as geishaCard}
          <div class="aspect-[2/3]">
            <p>{geishaCard.color}</p>
            <p>{geishaCard.charmPoints}</p>
            <p>{geishaCard.favoredPlayerID}</p>
            <p>Opponent Cards: {geishaCard.playerItemCards[opponentPlayerID].length}</p>
            <Card type='geisha' color={geishaCard.color} />
          </div>
        {/each}
      </div>
      <div aria-label="your-played-cards"></div>
    </section>
    <section aria-label="your-actions" class="flex flex-row justify-evenly space-x-2 items-end">
      {#each getActions(playerID) as action, i}
        <button
          on:click={client.moves.selectAction(i.toString())}
          class="border-2 border-black aspect-square hover:cursor-pointer disabled:cursor-default aspect-square h-[33%]"
          disabled={!action.enabled || availableMove !== 'selectAction'}
        >
          {`Action ${i + 1}`}
        </button>
      {/each}
    </section>
    <section aria-label="your-hand" class="flex flex-row justify-center space-x-2">
      {#each G.players[playerID].hand as card, index}
        <button
          on:click={() => addCardToSelectedCards({ ...card, index })}
          class="aspect-[8/11] h-full"
        >
          <Card type= 'item' color={card.color} /> 
        </button>
      {/each}
    </section>
  </main>
{/if}
