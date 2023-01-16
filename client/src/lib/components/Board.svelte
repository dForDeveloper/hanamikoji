<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import GeishaCardArea from '$lib/components/GeishaCardArea.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import SharedInterface from '$lib/components/SharedInterface.svelte';
  import { onDestroy } from 'svelte';
  import { Stage } from 'game-logic';
  import type { GameState, GeishaCard, Player } from 'game-logic';
  import type { Ctx } from 'boardgame.io';
  import type { SelectedCard } from '$lib/types';

  export let client: any;
  const matchID: string = client.matchID;
  const playerID: string = client.playerID;
  const opponentID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let hasGameStarted = false;
  let playerStage: Stage;
  let opponentStage: Stage;
  let currentAction: string;
  let selectedCards: SelectedCard[] = [null, null, null, null];
  let selectedFromPresented = '';
  let winnerID: string;

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState && gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      setHasGameStarted();
      setPlayerStages(ctx);
      setCurrentAction(G);
      setSelectedCardsFromHand([null, null, null, null]);
      setSelectedFromPresented('');
      setWinner(ctx);
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

  function setHasGameStarted(): void {
    if (!hasGameStarted) {
      const connectedPlayers = client.matchData.filter((player: { id: number; name: string; isConnected: boolean }) => {
        return player.isConnected;
      });

      if (connectedPlayers.length === 2) {
        hasGameStarted = true;
      }
    }
  }

  function setPlayerStages(ctx: Ctx): void {
    if (ctx.activePlayers && ctx.activePlayers[playerID]) {
      playerStage = ctx.activePlayers[playerID] as Stage;
    } else {
      playerStage = Stage.NULL;
    }

    if (ctx.activePlayers && ctx.activePlayers[opponentID]) {
      opponentStage = ctx.activePlayers[opponentID] as Stage;
    } else {
      opponentStage = Stage.NULL;
    }
  }

  function setCurrentAction(G: GameState): void {
    currentAction = G.currentAction ? G.currentAction : '';
  }

  function setSelectedCardsFromHand(updatedSelectedCards: SelectedCard[]): void {
    selectedCards = updatedSelectedCards;
  }

  function setSelectedFromPresented(updatedSelectedFromPresented: string): void {
    selectedFromPresented = updatedSelectedFromPresented;
  }

  function setWinner(ctx: Ctx): void {
    if (ctx.gameover) {
      winnerID = ctx.gameover.winner;
    }
  }

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
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito bg-purple-100">
    <Opponent player={getPlayer(G, opponentID)} />
    <SharedInterface
      {G}
      {hasGameStarted}
      {matchID}
      {playerID}
      {opponentID}
      {playerStage}
      {opponentStage}
      {currentAction}
      {selectedCards}
      {selectedFromPresented}
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
      {setSelectedFromPresented}
    />
    <GeishaCardArea geishaCards={getGeishaCards(G)} {playerID} {opponentID} />
    <Actions player={getPlayer(G, playerID)} {playerStage} {selectAction} {revealHiddenCard} />
    <Hand
      player={getPlayer(G, playerID)}
      {hasGameStarted}
      {playerStage}
      {selectedCards}
      {currentAction}
      {setSelectedCardsFromHand}
    />
  </main>
{/if}
