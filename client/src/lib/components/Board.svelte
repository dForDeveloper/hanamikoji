<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import Card from '$lib/components/Card.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import { getInstructions } from '$lib/utils';
  import { onDestroy } from 'svelte';
  import type { GameState, GeishaCard } from 'game-logic';
  import type { Ctx } from 'boardgame.io';
  import type { SelectedCard } from '$lib/types';

  export let client: any;
  const playerID: string = client.playerID;
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let playerStage: string;
  let opponentStage: string;
  let currentAction: string;
  let selectedCards: SelectedCard[] = [null, null, null, null];

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction ? G.currentAction : '';
      playerStage = ctx.activePlayers ? ctx.activePlayers[playerID] : '';
      opponentStage = ctx.activePlayers ? ctx.activePlayers[opponentPlayerID] : '';
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

  function getGeishaCards(G: GameState): GeishaCard[] {
    return Object.values(G.geisha);
  }

  function getAvailableMove(ctx: Ctx): string {
    if (ctx.activePlayers && ctx.activePlayers[playerID]) {
      return ctx.activePlayers[playerID];
    } else {
      return '';
    }
  }

  function getSelectedCardsToDisplay(currentAction: string, selectedCards: SelectedCard[]): SelectedCard[] {
    return selectedCards.slice(0, Number(currentAction) + 1);
  }

  function selectAction(actionIndex: string): void {
    client.moves.selectAction(actionIndex);
  }

  function setSelectedCards(updatedSelectedCards: SelectedCard[]): void {
    selectedCards = updatedSelectedCards;
  }

  function confirmSelection(selectedCards: SelectedCard[]): void {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const arg = selectedCards.filter((maybeCard) => maybeCard !== null).map((itemCard) => itemCard!.index.toString());
      client.moves.selectCardsAsCurrent(arg);
      setSelectedCards([null, null, null, null]);
    }
  }

  function getIsConfirmationButtonDisabled(selectedCards: SelectedCard[]): boolean {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const requiredSelectedCardCount = Number(currentAction) + 1;
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      return nonNullSelectedCardCount !== requiredSelectedCardCount;
    } else {
      return false;
    }
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito">
    <Opponent {G} {opponentPlayerID} />
    <section aria-label="game-interface" class="grid grid-rows-[1fr_16.2vh_1fr]">
      <div aria-label="instruction" class="place-self-center max-w-prose h-full">
        {#each getInstructions(currentAction, playerStage, opponentStage) as line}
          <p class="text-3xl my-6">{line}</p>
        {/each}
      </div>
      <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
        {#if playerStage === 'draw'}
          <Deck handleClick={() => client.moves.draw()} />
        {:else if playerStage === 'selectCardsAsCurrentPlayer'}
          {#if currentAction === '0'}
            <div class="aspect-[8/11]">
              {#if selectedCards[0]}
                <Card type="item" color={selectedCards[0].color} />
              {:else}
                <Card type="empty" />
              {/if}
            </div>
          {:else if currentAction === '1' || currentAction === '2'}
            <div class="flex flex-row justify-center space-x-2">
              {#each getSelectedCardsToDisplay(currentAction, selectedCards) as selectedCard, i}
                <div class="aspect-[8/11] h-[16.2vh]">
                  {#if selectedCard && i <= Number(currentAction)}
                    <Card type="item" color={selectedCard.color} />
                  {:else}
                    <Card type="empty" />
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </div>
      <div aria-label="confirmation-button-area" class="grid pt-10 justify-items-center">
        {#if playerStage === 'selectCardsAsCurrentPlayer' || playerStage === 'selectCardsAsOpposingPlayer'}
          <button
            on:click={() => confirmSelection(selectedCards)}
            disabled={getIsConfirmationButtonDisabled(selectedCards)}
            class="bg-violet-300 text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:bg-gray-200 disabled:shadow-none"
          >
            confirm
          </button>
        {/if}
      </div>
    </section>
    <section aria-label="game-board" class="grid grid-rows-[11fr_10fr_11fr]">
      <div aria-label="opponent-played-cards" />
      <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-2 h-full">
        {#each getGeishaCards(G) as geishaCard}
          <div class="aspect-[2/3]">
            <Card type="geisha" color={geishaCard.color} />
          </div>
        {/each}
      </div>
      <div aria-label="your-played-cards" />
    </section>
    <Actions {G} {playerID} {playerStage} {selectAction} />
    <Hand {G} {playerID} {playerStage} {selectedCards} {currentAction} {setSelectedCards} />
  </main>
{/if}
