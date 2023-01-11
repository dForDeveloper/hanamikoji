<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import Card from '$lib/components/Card.svelte';
  import CardStack from '$lib/components/CardStack.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import SelectedCardArea from '$lib/components/SelectedCardArea.svelte';
  import { onDestroy } from 'svelte';
  import type { GameState, GeishaCard, Player } from 'game-logic';
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
  let selectedPresentedIndex = '';

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState && gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction ? G.currentAction : '';
      playerStage = ctx.activePlayers ? ctx.activePlayers[playerID] : '';
      opponentStage = ctx.activePlayers ? ctx.activePlayers[opponentPlayerID] : '';
      setSelectedCardsFromHand([null, null, null, null]);
      setSelectedPresentedIndex('');
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

  function selectCardsAsCurrent(selectedIndexes: string[]): void {
    client.moves.selectCardsAsCurrent(selectedIndexes);
  }

  function selectCardsAsOpposing(selectedIndex: string): void {
    client.moves.selectCardsAsOpposing(selectedIndex);
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

  function setSelectedPresentedIndex(updatedSelectedPresentedIndex: string): void {
    selectedPresentedIndex = updatedSelectedPresentedIndex;
  }


</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito">
    <Opponent player={getPlayer(G, opponentPlayerID)} />
    <SelectedCardArea
      {G}
      {playerID}
      {opponentPlayerID}
      {playerStage}
      {opponentStage}
      {currentAction}
      {selectedCards}
      {selectedPresentedIndex}
      {getPlayer}
      {drawCard}
      {undoAction}
      {selectCardsAsCurrent}
      {selectCardsAsOpposing}
      {acknowledgeChoice}
      {acknowledgeReveal}
      {setSelectedPresentedIndex}
    />
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
