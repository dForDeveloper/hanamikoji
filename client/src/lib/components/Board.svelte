<script lang="ts">
  import AcknowledgeReveal from '$lib/components/AcknowledgeReveal.svelte';
  import AcknowledgeChoice from '$lib/components/AcknowledgeChoice.svelte';
  import Actions from '$lib/components/Actions.svelte';
  import Card from '$lib/components/Card.svelte';
  import CardStack from '$lib/components/CardStack.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import SelectedCardArea from '$lib/components/SelectedCardArea.svelte';
  import { getInstructions } from '$lib/instruction-messages';
  import { onDestroy } from 'svelte';
  import type { Action, GameState, GeishaCard, ItemCard, Player } from 'game-logic';
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
  let opponentChoice = '';

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState && gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction ? G.currentAction : '';
      playerStage = ctx.activePlayers ? ctx.activePlayers[playerID] : '';
      opponentStage = ctx.activePlayers ? ctx.activePlayers[opponentPlayerID] : '';
      opponentChoice = G.opponentChoice;
      setSelectedCardsFromHand([null, null, null, null]);
      presentedSelection = '';
    } else {
      client.getState();
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

  function getPresentedCards(G: GameState, currentAction: string): ItemCard[] {
    if (currentAction === '2') {
      return G.presentedCards;
    } else if (currentAction === '3') {
      return G.presentedPairs.flat();
    } else {
      throw new Error('Presented cards should not exist');
    }
  }

  function drawCard(): void {
    client.moves.draw();
  }

  function selectAction(actionIndex: string): void {
    client.moves.selectAction(actionIndex);
  }

  function undoAction(): void {
    setSelectedCardsFromHand([null, null, null, null]);
    client.undo();
  }

  function acknowledgeChoice(): void {
    client.moves.acknowledgeOpponentChoice();
  }

  function revealHiddenCard(): void {
    client.moves.reveal();
  }

  function acknowledgeReveal(): void {
    client.moves.acknowledgeReveal();
  }

  function setSelectedCardsFromHand(updatedSelectedCards: SelectedCard[]): void {
    selectedCards = updatedSelectedCards;
  }

  function setPresentedSelection(updatedPresentedSelection: string): void {
    presentedSelection = updatedPresentedSelection;
  }

  function confirmSelection(selectedCards: SelectedCard[], presentedSelection: string): void {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const selectedCardIndexes = selectedCards.filter((maybeCard) => maybeCard !== null).map((itemCard) => itemCard!.index.toString());
      client.moves.selectCardsAsCurrent(selectedCardIndexes);
    } else if (playerStage === 'selectCardsAsOpposingPlayer') {
      client.moves.selectCardsAsOpposing(presentedSelection);
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
      throw new Error('Confirmation button should exist');
    }
  }

  function getIsActionUndoable(G: GameState, id: string): boolean {
    const player = getPlayer(G, id);
    return Object.values(player.actions).some((action: Action) => action.enabled);
  }

  function getRevealedCard(G: GameState, playerStage: string, opponentStage: string): ItemCard {
    let player;
    if (playerStage === 'acknowledgeReveal') {
      player = getPlayer(G, opponentPlayerID);
    } else if (opponentStage === 'acknowledgeReveal') {
      player = getPlayer(G, playerID);
    }

    if (player && player.actions[0].savedCard) {
      return player.actions[0].savedCard;
    } else {
      throw new Error('No hidden card to reveal');
    }
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito">
    <Opponent player={getPlayer(G, opponentPlayerID)} />
    {#if playerStage === 'acknowledgeOpponentChoice' || opponentStage === 'acknowledgeOpponentChoice'}
      <AcknowledgeChoice
        presentedCards={getPresentedCards(G, currentAction)}
        {playerStage}
        {opponentStage}
        {currentAction}
        {opponentChoice}
        {acknowledgeChoice}
      />
    {:else if playerStage === 'acknowledgeReveal' || opponentStage === 'acknowledgeReveal'}
      <AcknowledgeReveal
        revealedCard={getRevealedCard(G, playerStage, opponentStage)}
        {playerStage}
        {opponentStage}
        {currentAction}
        {acknowledgeReveal}
      />
    {:else}
      <section aria-label="game-interface" class="grid grid-rows-[1fr_16.2vh_1fr]">
        <div aria-label="instruction" class="place-self-center max-w-prose h-full">
          {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
            <p class="text-3xl my-6">{instruction}</p>
          {/each}
        </div>
        <SelectedCardArea
          presentedCards={getPresentedCards(G, currentAction)}
          {playerStage}
          {opponentStage}
          {currentAction}
          {presentedSelection}
          {selectedCards}
          {drawCard}
          {setPresentedSelection}
        />
        <div class="flex pt-10 justify-center gap-8">
          {#if playerStage === 'selectCardsAsCurrentPlayer' && getIsActionUndoable(G, playerID)}
            <button
              on:click={() => undoAction()}
              class="bg-gray-600 text-white text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600"
            >
              undo
            </button>
          {/if}
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
    {/if}
    <section aria-label="game-board" class="grid grid-rows-[1fr_20vh_1fr]">
      <div aria-label="opponent-played-cards" class="flex flex-row justify-center space-x-4">
        {#each getGeishaCards(G) as geishaCard}
          <CardStack
            color={geishaCard.color}
            count={geishaCard.playerItemCards[opponentPlayerID].length}
            isFlipped={true}
          />
        {/each}
      </div>
      <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-4">
        {#each getGeishaCards(G) as geishaCard}
          <div>
            <Card type="geisha" color={geishaCard.color} />
          </div>
        {/each}
      </div>
      <div aria-label="your-played-cards" class="flex flex-row justify-center space-x-4">
        {#each getGeishaCards(G) as geishaCard}
          <CardStack color={geishaCard.color} count={geishaCard.playerItemCards[playerID].length} />
        {/each}
      </div>
    </section>
    <Actions player={getPlayer(G, playerID)} {playerStage} {opponentStage} {selectAction} {revealHiddenCard} />
    <Hand player={getPlayer(G, playerID)} {playerStage} {selectedCards} {currentAction} {setSelectedCardsFromHand} />
  </main>
{/if}
