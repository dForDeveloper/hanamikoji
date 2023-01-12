<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import GeishaCardArea from '$lib/components/GeishaCardArea.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import SharedPlayerInterface from '$lib/components/SharedPlayerInterface.svelte';
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

  function getPlayer(G: GameState, id: string): Player {
    return G.players[id];
  }

  function getGeishaCards(G: GameState): GeishaCard[] {
    return Object.values(G.geisha);
  }

  function drawCard(): void {
    client.moves.draw();
  }

  function selectAction(actionIndex: string): void {
    client.moves.selectAction(actionIndex);
  }

  function undoAction(): void {
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
    <SharedPlayerInterface
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
    <GeishaCardArea geishaCards={getGeishaCards(G)} {playerID} {opponentPlayerID} />
    <Actions player={getPlayer(G, playerID)} {playerStage} {opponentStage} {selectAction} {revealHiddenCard} />
    <Hand player={getPlayer(G, playerID)} {playerStage} {selectedCards} {currentAction} {setSelectedCardsFromHand} />
  </main>
{/if}
