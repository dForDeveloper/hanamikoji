<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import GeishaCardArea from '$lib/components/GeishaCardArea.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import SharedPlayerInterface from '$lib/components/SharedPlayerInterface.svelte';
  import { onDestroy } from 'svelte';
  import type { GameState, GeishaCard, Player, Stage } from 'game-logic';
  import type { Ctx } from 'boardgame.io';
  import type { SelectedCard } from '$lib/types';

  export let client: any;
  const playerID: string = client.playerID;
  const opponentID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let playerStage: Stage | null;
  let opponentStage: Stage | null;
  let currentAction: string;
  let selectedCards: SelectedCard[] = [null, null, null, null];
  let selectedPresentedIndex = '';
  let winnerID: string;

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState && gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction ? G.currentAction : '';

      if (ctx.activePlayers && ctx.activePlayers[playerID]) {
        playerStage = ctx.activePlayers[playerID] as Stage;
      } else {
        playerStage = null;
      }

      if (ctx.activePlayers && ctx.activePlayers[opponentID]) {
        opponentStage = ctx.activePlayers[opponentID] as Stage;
      } else {
        opponentStage = null;
      }

      setSelectedCardsFromHand([null, null, null, null]);
      setSelectedPresentedIndex('');

      if (ctx.gameover) {
        winnerID = ctx.gameover.winner;
      }
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

  function calculateScore(): void {
    client.moves.calculateScore();
  }

  function readyUp(): void {
    client.moves.readyUp();
  }

  function setSelectedCardsFromHand(updatedSelectedCards: SelectedCard[]): void {
    selectedCards = updatedSelectedCards;
  }

  function setSelectedPresentedIndex(updatedSelectedPresentedIndex: string): void {
    selectedPresentedIndex = updatedSelectedPresentedIndex;
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito bg-purple-100">
    <Opponent player={getPlayer(G, opponentID)} />
    <SharedPlayerInterface
      {G}
      {playerID}
      {opponentID}
      {playerStage}
      {opponentStage}
      {currentAction}
      {selectedCards}
      {selectedPresentedIndex}
      {winnerID}
      {getPlayer}
      {drawCard}
      {undoAction}
      {selectCardsAsCurrent}
      {selectCardsAsOpposing}
      {acknowledgeChoice}
      {acknowledgeReveal}
      {calculateScore}
      {readyUp}
      {setSelectedPresentedIndex}
    />
    <GeishaCardArea geishaCards={getGeishaCards(G)} {playerID} {opponentID} />
    <Actions player={getPlayer(G, playerID)} {playerStage} {opponentStage} {selectAction} {revealHiddenCard} />
    <Hand player={getPlayer(G, playerID)} {playerStage} {selectedCards} {currentAction} {setSelectedCardsFromHand} />
  </main>
{/if}
