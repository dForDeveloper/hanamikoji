<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import Card from '$lib/components/Card.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import { getInstructions } from '$lib/utils';
  import { onDestroy } from 'svelte';
  import type { GameState, GeishaCard, ItemCard, Player } from 'game-logic';
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
  let presentedSelection = '';

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

  function getPlayer(G: GameState, id: string): Player {
    return G.players[id];
  }

  function getSelectedCardsToDisplay(currentAction: string, selectedCards: SelectedCard[]): SelectedCard[] {
    return selectedCards.slice(0, Number(currentAction) + 1);
  }

  function getPresentedCardsToDisplay(G: GameState, currentAction: string): ItemCard[] {
    if (currentAction === '2') {
      return G.presentedCards;
    } else {
      return G.presentedPairs.flat();
    }
  }

  function drawCard(): void {
    client.moves.draw();
  }

  function selectAction(actionIndex: string): void {
    client.moves.selectAction(actionIndex);
  }

  function setSelectedCards(updatedSelectedCards: SelectedCard[]): void {
    selectedCards = updatedSelectedCards;
  }

  function confirmSelection(selectedCards: SelectedCard[], presentedSelection: string): void {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const arg = selectedCards.filter((maybeCard) => maybeCard !== null).map((itemCard) => itemCard!.index.toString());
      client.moves.selectCardsAsCurrent(arg);
      setSelectedCards([null, null, null, null]);
    } else if (playerStage === 'selectCardsAsOpposingPlayer') {
      client.moves.selectCardsAsOpposing(presentedSelection);
      presentedSelection = '';
    }
  }

  function getIsConfirmationButtonDisabled(selectedCards: SelectedCard[], presentedSelection: string): boolean {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const requiredSelectedCardCount = Number(currentAction) + 1;
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      return nonNullSelectedCardCount !== requiredSelectedCardCount;
    } else if (playerStage === 'selectCardsAsOpposingPlayer') {
      return presentedSelection === '';
    } else {
      return false;
    }
  }

  function selectFromPresented(i: number): void {
    presentedSelection = i.toString();
  }

  function deselectFromPresented(): void {
    presentedSelection = '';
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito">
    <Opponent player={getPlayer(G, opponentPlayerID)} />
    <section aria-label="game-interface" class="grid grid-rows-[1fr_16.2vh_1fr]">
      <div aria-label="instruction" class="place-self-center max-w-prose h-full">
        {#each getInstructions(currentAction, playerStage, opponentStage) as line}
          <p class="text-3xl my-6">{line}</p>
        {/each}
      </div>
      <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
        {#if playerStage}
          {#if playerStage === 'draw'}
            <Deck handleClick={() => drawCard()} isDisabled={false} />
          {:else if playerStage === 'selectCardsAsCurrentPlayer'}
            <div class="flex flex-row justify-center space-x-2">
              {#each getSelectedCardsToDisplay(currentAction, selectedCards) as selectedCard, i}
                {#if currentAction === '3' && i === 2}
                  <div class="h-[16.2vh] w-[11.53vh]" />
                {/if}
                <div class="h-[16.2vh] w-[11.53vh]">
                  {#if selectedCard}
                    <Card type="item" color={selectedCard.color} />
                  {:else}
                    <Card type="empty" />
                  {/if}
                </div>
              {/each}
            </div>
          {:else if playerStage === 'selectCardsAsOpposingPlayer'}
            {#if currentAction === '2'}
              <div class="flex flex-row justify-center space-x-2">
                {#each G.presentedCards as card, i}
                  {#if presentedSelection === i.toString()}
                    <button on:click={() => deselectFromPresented()} class="h-[16.2vh] w-[11.53vh]">
                      <Card type="item" color={card.color} isSelected={true} isHoverable={true} isInverted={true} />
                    </button>
                  {:else}
                    <button on:click={() => selectFromPresented(i)} class="h-[16.2vh] w-[11.53vh]">
                      <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
                    </button>
                  {/if}
                {/each}
              </div>
            {:else if currentAction === '3'}
              <div class="flex flex-row justify-center space-x-2" />
            {/if}
          {/if}
        {:else if opponentStage}
          {#if opponentStage === 'draw'}
            <Deck handleClick={() => false} isDisabled={true} />
          {:else if opponentStage === 'selectCardsAsCurrentPlayer' || opponentStage === 'selectCardsAsOpposingPlayer'}
            <div class="flex flex-row justify-center space-x-2">
              {#if opponentStage === 'selectCardsAsCurrentPlayer'}
                {#each Array(Number(currentAction) + 1) as _, i}
                  {#if currentAction === '3' && i === 2}
                    <div class="h-[16.2vh] w-[11.53vh]" />
                  {/if}
                  <div class="h-[16.2vh] w-[11.53vh]">
                    <Card type="empty" />
                  </div>
                {/each}
              {:else if opponentStage === 'selectCardsAsOpposingPlayer'}
                {#each getPresentedCardsToDisplay(G, currentAction) as card, i}
                  {#if currentAction === '3' && i === 2}
                    <div class="h-[16.2vh] w-[11.53vh]" />
                  {/if}
                  <div class="h-[16.2vh] w-[11.53vh]">
                    <Card type="item" color={card.color} />
                  </div>
                {/each}
              {/if}
            </div>
          {/if}
        {/if}
      </div>
      <div class="grid pt-10 justify-items-center">
        {#if playerStage === 'selectCardsAsCurrentPlayer' || playerStage === 'selectCardsAsOpposingPlayer'}
          <button
            on:click={() => confirmSelection(selectedCards, presentedSelection)}
            disabled={getIsConfirmationButtonDisabled(selectedCards, presentedSelection)}
            class="bg-violet-300 text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:bg-gray-200 disabled:shadow-none"
          >
            confirm
          </button>
        {/if}
      </div>
    </section>
    <section aria-label="game-board" class="grid grid-rows-[11fr_10fr_11fr]">
      <section aria-label="opponent-played-cards" />
      <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-2 h-full">
        {#each getGeishaCards(G) as geishaCard}
          <div>
            <Card type="geisha" color={geishaCard.color} />
          </div>
        {/each}
      </div>
      <section aria-label="your-played-cards" />
    </section>
    <Actions player={getPlayer(G, playerID)} {playerStage} {selectAction} />
    <Hand player={getPlayer(G, playerID)} {playerStage} {selectedCards} {currentAction} {setSelectedCards} />
  </main>
{/if}
