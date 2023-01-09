<script lang="ts">
  import Actions from '$lib/components/Actions.svelte';
  import Card from '$lib/components/Card.svelte';
  import CardStack from '$lib/components/CardStack.svelte';
  import Hand from '$lib/components/Hand.svelte';
  import Opponent from '$lib/components/Opponent.svelte';
  import SelectedCardArea from '$lib/components/SelectedCardArea.svelte';
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
  let opponentChoice = '';

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction ? G.currentAction : '';
      playerStage = ctx.activePlayers ? ctx.activePlayers[playerID] : '';
      opponentStage = ctx.activePlayers ? ctx.activePlayers[opponentPlayerID] : '';
      opponentChoice = G.opponentChoice;
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

  function getPresentedCards(G: GameState, currentAction: string): ItemCard[] {
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

  function switchAction(actionIndex: string): void {
    setSelectedCardsFromHand([null, null, null, null]);
    client.undo();
    client.moves.selectAction(actionIndex);
  }

  function setSelectedCardsFromHand(updatedSelectedCards: SelectedCard[]): void {
    selectedCards = updatedSelectedCards;
  }

  function setPresentedSelection(updatedPresentedSelection: string): void {
    presentedSelection = updatedPresentedSelection;
  }

  function confirmSelection(selectedCards: SelectedCard[], presentedSelection: string): void {
    if (playerStage === 'selectCardsAsCurrentPlayer') {
      const arg = selectedCards.filter((maybeCard) => maybeCard !== null).map((itemCard) => itemCard!.index.toString());
      client.moves.selectCardsAsCurrent(arg);
      setSelectedCardsFromHand([null, null, null, null]);
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

  function getCardsToAcknowledge(G: GameState, currentAction: string, opponentChoice: string, id: string, playerStage: string): ItemCard[] {
    if (playerStage === 'acknowledgeOpponentChoice') {
      if (id === playerID) {
        return getCurrentPlayerCardsToAcknowledge(G, currentAction, opponentChoice);
      } else {
        return getChoosingPlayerCardsToAcknowledge(G, currentAction, opponentChoice);
      }
    } else {
      if (id === playerID) {
        return getChoosingPlayerCardsToAcknowledge(G, currentAction, opponentChoice);
      } else {
        return getCurrentPlayerCardsToAcknowledge(G, currentAction, opponentChoice);
      }
    }
  }

  function getChoosingPlayerCardsToAcknowledge(G: GameState, currentAction: string, opponentChoice: string): ItemCard[] {
    const presentedCards = getPresentedCards(G, currentAction);
    if (currentAction === '3') {
      return opponentChoice === '0' ? presentedCards.slice(0, 2) : presentedCards.slice(2, 4);
    } else {
      return presentedCards.filter((card, i) => i === Number(opponentChoice));
    }
  }

  function getCurrentPlayerCardsToAcknowledge(G: GameState, currentAction: string, opponentChoice: string): ItemCard[] {
    const presentedCards = getPresentedCards(G, currentAction);
    if (currentAction === '3') {
      return opponentChoice === '0' ? presentedCards.slice(2, 4) : presentedCards.slice(0, 2);
    } else {
      return presentedCards.filter((card, i) => i !== Number(opponentChoice));
    }
  }

  function acknowledgeOpponentChoice(): void {
    client.moves.acknowledge();
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito">
    <Opponent player={getPlayer(G, opponentPlayerID)} />
    {#if playerStage === 'acknowledgeOpponentChoice' || opponentStage === 'acknowledgeOpponentChoice'}
      <section aria-label="game-interface" class="grid grid-rows-[1fr_20vh_1fr]">
        <div class="flex flex-row justify-center space-x-2 items-end pb-2">
          {#each getCardsToAcknowledge(G, currentAction, opponentChoice, opponentPlayerID, playerStage) as card}
            <div class="h-[16.2vh] w-[11.53vh]">
              <Card type="item" color={card.color} />
            </div>
          {/each}
        </div>
        <div aria-label="instruction" class="flex flex-col place-self-center max-w-prose justify-content-center">
          {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
            <p class="text-3xl my-6">{instruction}</p>
          {/each}
          {#if playerStage === 'acknowledgeOpponentChoice'}
            <button
              on:click={() => acknowledgeOpponentChoice()}
              class="bg-violet-300 text-xl h-14 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 place-self-center"
            >
              accept
            </button>
          {/if}
        </div>
        <div class="flex flex-row justify-center space-x-2 pt-2">
          {#each getCardsToAcknowledge(G, currentAction, opponentChoice, playerID, playerStage) as card}
            <div class="h-[16.2vh] w-[11.53vh]">
              <Card type="item" color={card.color} />
            </div>
          {/each}
        </div>
      </section>
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
    {/if}
    <section aria-label="game-board" class="grid grid-rows-[1fr_20vh_1fr]">
      <div aria-label="opponent-played-cards" class="flex flex-row justify-center space-x-4">
        {#each getGeishaCards(G) as geishaCard}
          <!-- <CardStack color={geishaCard.color} count={geishaCard.color === 'purple' ? 1 : geishaCard.charmPoints} isFlipped={true} /> -->
          <CardStack color={geishaCard.color} count={geishaCard.playerItemCards[opponentPlayerID].length} isFlipped={true} />
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
          <!-- <CardStack color={geishaCard.color} count={geishaCard.color === 'purple' ? 1 : geishaCard.charmPoints} /> -->
          <CardStack color={geishaCard.color} count={geishaCard.playerItemCards[playerID].length} />
        {/each}
      </div>
    </section>
    <Actions player={getPlayer(G, playerID)} {playerStage} {selectAction} {switchAction} />
    <Hand player={getPlayer(G, playerID)} {playerStage} {selectedCards} {currentAction} {setSelectedCardsFromHand} />
  </main>
{/if}
