<script lang="ts">
  import ActionMarker from '$lib/components/ActionMarker.svelte';
  import Card from '$lib/components/Card.svelte';
  import { onDestroy } from 'svelte';
  import type { Action, GameState, GeishaCard, ItemCard } from 'game-logic';
  import type { Ctx } from 'boardgame.io';

  type SelectedCards = Record<string, Array<ItemCard & { index: number }>>;

  export let client: any;
  const playerID: string = client.playerID;
  const opponentPlayerID = playerID === '0' ? '1' : '0';
  let G: GameState;
  let ctx: Ctx;
  let availableMove = '';
  let currentAction: string | null = null;
  let selectedCards: SelectedCards = {
    action1: [],
    action2: [],
    action3: [],
    action4: [],
  };

  const unsubscribe = client.subscribe((gameState: { G: GameState; ctx: Ctx }) => {
    if (gameState.G && gameState.ctx) {
      G = gameState.G;
      ctx = gameState.ctx;
      currentAction = G.currentAction;
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

  function getInstruction(ctx: Ctx): string[] {
    const errorMessage = ['ERROR: No player has any available moves to make'];
    if (ctx.activePlayers) {
      const playerStage: string | undefined = ctx.activePlayers[playerID];
      const opponentStage: string = ctx.activePlayers[opponentPlayerID];
      if (opponentStage) {
        switch (opponentStage) {
          case 'draw':
            return ['Waiting for opponent to draw a card'];
          case 'selectAction':
            return ['Waiting for opponent to select an action'];
          case 'selectCardsAsCurrentPlayer':
            return ['Waiting for opponent to select cards'];
          case 'selectCardsAsOpposingPlayer':
            return ['Waiting for opponent to select cards'];
          case 'reveal':
            return ['Opponent in reveal stage'];
          case 'calculate':
            return ['Opponent in calculate stage'];
          case 'prepareNextRound':
            return ['Opponent in prepareNextRound stage'];
          default:
            return errorMessage;
        }
      } else if (playerStage) {
        switch (playerStage) {
          case 'draw':
            return ["It's your turn.", 'Draw a card.'];
          case 'selectAction':
            return ['Select an action.'];
          case 'selectCardsAsCurrentPlayer':
            switch (currentAction) {
              case '0':
                return [
                  'Choose 1 card from your hand.',
                  'This card will be hidden from your opponent.',
                  'At the end of the round you will reveal and score this card.',
                ];
              case '1':
                return [
                  'Choose 2 cards from your hand.',
                  "These cards will be hidden from your opponent and won't be scored this round.",
                ];
              case '2':
                return [
                  'Choose 3 cards from your hand to reveal to your opponent.',
                  'They will choose one of the cards to score for themself.',
                  'You will score the remaining two cards.',
                ];
              case '3':
                return [
                  'Choose 4 cards from your hand separated into two sets of two to reveal to your opponent.',
                  'They will choose one set to score for themself.',
                  'You will score the remaining set.',
                ];
              default:
                return errorMessage;
            }
          case 'selectCardsAsOpposingPlayer':
            switch (currentAction) {
              case '2':
                return [
                  'Your opponent revealed these cards.',
                  'Choose one of them to score for yourself.',
                  'They will score the remaining cards.',
                ];
              case '3':
                return [
                  'Your opponent revealed these sets of cards',
                  'Choose one to score for yourself.',
                  'They will score the remaining set.',
                ];
              default:
                return errorMessage;
            }
          case 'reveal':
            return ['reveal stage'];
          case 'calculate':
            return ['calculate stage'];
          case 'prepareNextRound':
            return ['prepareNextRound stage'];
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

  function addCardToSelectedCards(itemCardWithIndex: ItemCard & { index: number }): void {
    if (availableMove === 'selectCardsAsCurrentPlayer') {
      if (currentAction === '0') {
        selectedCards = { ...selectedCards, action1: [itemCardWithIndex] };
      } else if (currentAction === '1') {
        const action2 = selectedCards.action2;
        selectedCards = { ...selectedCards, action2: [...action2, itemCardWithIndex] };
      } else if (currentAction === '2') {
        const action3 = selectedCards.action3;
        selectedCards = { ...selectedCards, action3: [...action3, itemCardWithIndex] };
      } else if (currentAction === '3') {
        const action4 = selectedCards.action4;
        selectedCards = { ...selectedCards, action4: [...action4, itemCardWithIndex] };
      }
    }
  }

  function removeCardFromSelectedCards(index: number): void {
    if (availableMove === 'selectCardsAsCurrentPlayer') {
      const currentActionPlus1 = Number(currentAction) + 1;
      const key = `action${currentActionPlus1}`;
      const updatedSelectedCardsActionValue = selectedCards[key].filter((itemCard) => itemCard.index !== index);
      selectedCards = { ...selectedCards, [key]: updatedSelectedCardsActionValue };
    }
  }

  function getIsSelected(selectedCards: SelectedCards, index: number): boolean {
    if (availableMove === 'selectCardsAsCurrentPlayer' && currentAction) {
      const currentActionPlus1 = Number(currentAction) + 1;
      const key = `action${currentActionPlus1}`;
      const maybeSelectedCard = selectedCards[key].find((itemCard) => itemCard.index === index);
      return maybeSelectedCard !== undefined;
    } else {
      return false;
    }
  }
</script>

{#if G && ctx}
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2 font-nunito">
    <section aria-label="opponent-actions" class="flex flex-row justify-evenly space-x-2">
      {#each getActions(opponentPlayerID) as action, i}
        <div class="aspect-square disabled:cursor-default aspect-square rounded-md h-[8vh] shadow-sm shadow-black">
          <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
        </div>
      {/each}
    </section>
    <section aria-label="opponent-hand" class="flex flex-row justify-center space-x-2">
      {#each getHand(opponentPlayerID) as card}
        <div class="aspect-[8/11]">
          <Card type="back" />
        </div>
      {/each}
    </section>
    <section aria-label="game-interface" class="grid grid-rows-[75fr_50fr_75fr]">
      <div aria-label="instruction" class="place-self-center max-w-prose h-full">
        {#each getInstruction(ctx) as line}
          <p class="text-3xl my-6">{line}</p>
        {/each}
        {#if availableMove === 'draw'}
          <button on:click={client.moves.draw()} class="bg-sky-500 hover:bg-sky-900 hover:cursor-pointer">
            Draw a card
          </button>
        {/if}
      </div>
      <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
        {#if availableMove === 'selectCardsAsCurrentPlayer'}
          {#if currentAction === '0'}
            {#if selectedCards.action1[0]}
              <div class="aspect-[8/11] h-full">
                <Card type="item" color={selectedCards.action1[0].color} />
              </div>
            {:else}
              <div class="aspect-[8/11] h-full border-2 border-black border-dashed rounded-xl" />
            {/if}
          {/if}
        {/if}
      </div>
      <div aria-label="confirmation-button-area">confirmation button goes here</div>
    </section>
    <section aria-label="game-board" class="grid grid-rows-[11fr_10fr_11fr]">
      <div aria-label="opponent-played-cards" />
      <div aria-label="geisha-cards" class="flex flex-row justify-center space-x-2 h-full">
        {#each getGeishaCards() as geishaCard}
          <div class="aspect-[2/3]">
            <Card type="geisha" color={geishaCard.color} />
          </div>
        {/each}
      </div>
      <div aria-label="your-played-cards" />
    </section>
    <section aria-label="your-actions" class="flex flex-row justify-evenly space-x-2 items-end">
      {#each getActions(playerID) as action, i}
        {#if availableMove === 'selectAction'}
          <button
            on:click={client.moves.selectAction(i.toString())}
            class="aspect-square disabled:cursor-default aspect-square rounded-md h-[8vh] shadow-sm shadow-black"
            disabled={!action.enabled || availableMove !== 'selectAction'}
          >
            <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={action.enabled} />
          </button>
        {:else}
          <div class="aspect-square disabled:cursor-default aspect-square rounded-md h-[8vh] shadow-sm shadow-black">
            <ActionMarker index={i + 1} isEnabled={action.enabled} isHoverable={false} />
          </div>
        {/if}
      {/each}
    </section>
    <section aria-label="your-hand" class="flex flex-row justify-center space-x-2">
      {#each G.players[playerID].hand as card, index}
        {#if availableMove === 'selectCardsAsCurrentPlayer'}
          {#if getIsSelected(selectedCards, index)}
            <button on:click={() => removeCardFromSelectedCards(index)} class="aspect-[8/11] h-full">
              <Card type="item" color={card.color} isSelected={true} isHoverable={true} />
            </button>
          {:else}
            <button on:click={() => addCardToSelectedCards({ ...card, index })} class="aspect-[8/11] h-full">
              <Card type="item" color={card.color} isSelected={false} isHoverable={true} />
            </button>
          {/if}
        {:else}
          <div class="aspect-[8/11] h-full">
            <Card type="item" color={card.color} isSelected={false} isHoverable={false} />
          </div>
        {/if}
      {/each}
    </section>
  </main>
{/if}
