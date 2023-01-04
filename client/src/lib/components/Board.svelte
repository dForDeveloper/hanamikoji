<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import { getInstructions } from '$lib/utils';
  import { onDestroy } from 'svelte';
  import type { Action, GameState, GeishaCard, ItemCard } from 'game-logic';
  import type { Ctx } from 'boardgame.io';
  import type { SelectedCard } from '$lib/types';

  export let client: any;
  const playerID: string = client.playerID;
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let availableMove = '';
  let currentAction: string | null = null;
  let selectedCards: SelectedCard[] = [null, null, null, null];

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction;
      availableMove = getAvailableMove(ctx);
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

  function getActions(G: GameState, playerID: string): Action[] {
    return Object.values(G.players[playerID].actions);
  }

  function getCardsInHand(G: GameState, playerID: string): ItemCard[] {
    return G.players[playerID].hand;
  }

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

  function addCardToSelectedCards(selectedCard: SelectedCard): void {
    if (currentAction === '0') {
      selectedCards = [selectedCard, null, null, null];
    } else {
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      const enoughCardsHaveNotBeenSelected = nonNullSelectedCardCount <= Number(currentAction);

      const maybeFirstNullIndex = selectedCards.findIndex((maybeCard) => maybeCard === null);
      const theFirstOpenSpotIsValid = maybeFirstNullIndex !== -1 && maybeFirstNullIndex <= Number(currentAction);

      if (enoughCardsHaveNotBeenSelected && theFirstOpenSpotIsValid) {
        selectedCards = selectedCards.map((maybeCard, i) => {
          if (i === maybeFirstNullIndex) return selectedCard;
          return maybeCard;
        });
      }
    }
  }

  function removeCardFromSelectedCards(index: number): void {
    selectedCards = selectedCards.map((maybeCard) => {
      if (maybeCard && maybeCard.index === index) return null;
      return maybeCard;
    });
  }

  function confirmSelection(selectedCards: SelectedCard[]): void {
    if (availableMove === 'selectCardsAsCurrentPlayer') {
      const arg = selectedCards.filter((maybeCard) => maybeCard !== null).map((itemCard) => itemCard!.index.toString());
      client.moves.selectCardsAsCurrent(arg);
      selectedCards = [null, null, null, null];
    }
  }

  function getIsConfirmationButtonDisabled(selectedCards: SelectedCard[]): boolean {
    if (availableMove === 'selectCardsAsCurrentPlayer') {
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
    <Opponent actions={getActions(G, opponentPlayerID)} cardsInHand={getCardsInHand(G, opponentPlayerID)} />
    <section aria-label="game-interface" class="grid grid-rows-[1fr_16.2vh_1fr]">
      <div aria-label="instruction" class="place-self-center max-w-prose h-full">
        {#each getInstructions(ctx, currentAction, playerID, opponentPlayerID) as line}
          <p class="text-3xl my-6">{line}</p>
        {/each}
      </div>
      <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
        {#if availableMove === 'draw'}
          <Deck handleClick={() => client.moves.draw()} />
        {:else if availableMove === 'selectCardsAsCurrentPlayer'}
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
        {#if availableMove === 'selectCardsAsCurrentPlayer' || availableMove === 'selectCardsAsOpposingPlayer'}
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
    <section aria-label="your-actions" class="flex flex-row justify-evenly space-x-2 items-end">
      {#each getActions(G, playerID) as action, i}
        <div class="relative aspect-[8/11] h-[16.2vh] grid items-end justify-center">
          {#if availableMove === 'selectAction'}
            <button
              on:click={client.moves.selectAction(i.toString())}
              class="aspect-square disabled:cursor-default aspect-square rounded-md h-[8vh] shadow-sm shadow-black"
              disabled={!action.enabled}
            >
              <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={action.enabled} />
            </button>
          {:else}
            <button
              class="aspect-square disabled:cursor-default aspect-square rounded-md h-[8vh] shadow-sm shadow-black"
              disabled
            >
              <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
            </button>
          {/if}
          {#if action.savedCard}
            <div class="aspect-[8/11] h-[16.2vh] absolute -z-10">
              <Card type="item" color={action.savedCard.color} />
            </div>
          {/if}
          {#if action.discardedCards && action.discardedCards.length === 2}
            <div class="aspect-[8/11] h-[16.2vh] absolute -z-10 -translate-x-5">
              <Card type="item" color={action.discardedCards[0].color} />
            </div>
            <div class="aspect-[8/11] h-[16.2vh] absolute -z-10 translate-x-5">
              <Card type="item" color={action.discardedCards[1].color} />
            </div>
          {/if}
        </div>
      {/each}
    </section>
    <Hand
      cardsInHand={getCardsInHand(G, playerID)}
      {availableMove}
      {selectedCards}
      {removeCardFromSelectedCards}
      {addCardToSelectedCards}
    />
  </main>
{/if}
