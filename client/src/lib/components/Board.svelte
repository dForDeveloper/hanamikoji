<script lang="ts">
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
  let instruction = '';
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
      instruction = getInstruction();
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

  function getInstruction(): string {
    const errorMessage = 'ERROR: No player has any available moves to make';
    if (ctx.activePlayers) {
      const playerStage: string | undefined = ctx.activePlayers[playerID];
      const opponentStage: string = ctx.activePlayers[opponentPlayerID];
      if (opponentStage) {
        switch (opponentStage) {
          case 'draw':
            return 'Waiting for opponent to draw a card';
          case 'selectAction':
            return 'Waiting for opponent to select an action';
          case 'selectCardsAsCurrentPlayer':
            return 'Waiting for opponent to select cards';
          case 'selectCardsAsOpposingPlayer':
            return 'Waiting for opponent to select cards';
          case 'reveal':
            return 'Opponent in reveal stage';
          case 'calculate':
            return 'Opponent in calculate stage';
          case 'prepareNextRound':
            return 'Opponent in prepareNextRound stage';
          default:
            return errorMessage;
        }
      } else if (playerStage) {
        switch (playerStage) {
          case 'draw':
            return "It's the start of your turn. Draw a card.";
          case 'selectAction':
            return 'Select an action';
          case 'selectCardsAsCurrentPlayer':
            switch (currentAction) {
              case '0':
                return 'Choose 1 card from your hand. This card will be placed face down, and then it will be revealed and scored at the end of the round.';
              case '1':
                return 'Choose 2 cards from your hand. These cards will be placed face down and will not be scored this round.';
              case '2':
                return 'Choose 3 cards from your hand. These cards will be presented to your opponent. Your opponent will choose 1 of the cards to score for themself. You will score the remaining 2 cards.';
              case '3':
                return 'Choose 4 cards from your hand, and divide them into 2 pairs. These pairs will be presented to your opponent. Your opponent will choose 1 pair to score for themself. You will score the remaining pair.';
              default:
                return errorMessage;
            }
          case 'selectCardsAsOpposingPlayer':
            switch (currentAction) {
              case '2':
                return 'Your opponent chose to present these 3 cards. Choose 1 of these cards to score for yourself. They will score the remaining 2 cards.';
              case '3':
                return 'Your opponent chose to present these 2 pairs of cards. Choose 1 pair to score for yourself. They will score the remaining pair.';
              default:
                return errorMessage;
            }
          case 'reveal':
            return 'reveal stage';
          case 'calculate':
            return 'calculate stage';
          case 'prepareNextRound':
            return 'prepareNextRound stage';
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
  <main class="grid grid-cols-[2fr_3fr] grid-rows-[1fr_4fr_1fr] gap-2 h-screen p-2">
    <section aria-label="opponent-actions" class="flex flex-row justify-evenly space-x-2">
      {#each getActions(opponentPlayerID) as action, i}
        <div class="border-2 border-black aspect-square h-[33%]">
          {`Action ${i + 1}`}
        </div>
      {/each}
    </section>
    <section aria-label="opponent-hand" class="flex flex-row justify-center space-x-2">
      {#each getHand(opponentPlayerID) as card}
        <div class="aspect-[8/11]">
          <Card type="back" color={card.color} isSelected={false} />
        </div>
      {/each}
    </section>
    <section aria-label="game-interface" class="grid grid-rows-[75fr_50fr_75fr]">
      <div aria-label="instruction">
        <p>{instruction}</p>
        {#if availableMove === 'draw'}
          <button on:click={client.moves.draw()} class="bg-sky-500 hover:bg-sky-900 hover:cursor-pointer">
            Draw a card
          </button>
        {/if}
      </div>
      <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
        {#if availableMove === 'selectCardsAsCurrentPlayer'}
          {#if currentAction === '0'}
            {#if selectedCards.action1.at(0)}
              <div class="aspect-[8/11] h-full">
                <Card type="item" color={selectedCards.action1.at(0).color} isSelected={false} />
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
            <Card type="geisha" color={geishaCard.color} isSelected={false} />
          </div>
        {/each}
      </div>
      <div aria-label="your-played-cards" />
    </section>
    <section aria-label="your-actions" class="flex flex-row justify-evenly space-x-2 items-end">
      {#each getActions(playerID) as action, i}
        <button
          on:click={client.moves.selectAction(i.toString())}
          class="border-2 border-black aspect-square hover:cursor-pointer disabled:cursor-default aspect-square h-[33%]"
          disabled={!action.enabled || availableMove !== 'selectAction'}
        >
          {`Action ${i + 1}`}
        </button>
      {/each}
    </section>
    <section aria-label="your-hand" class="flex flex-row justify-center space-x-2">
      {#each G.players[playerID].hand as card, index}
        {#if availableMove === 'selectCardsAsCurrentPlayer'}
          {#if getIsSelected(selectedCards, index)}
            <button on:click={() => removeCardFromSelectedCards(index)} class="aspect-[8/11] h-full">
              <Card type="item" color={card.color} isSelected={true} />
            </button>
          {:else}
            <button on:click={() => addCardToSelectedCards({ ...card, index })} class="aspect-[8/11] h-full">
              <Card type="item" color={card.color} isSelected={false} />
            </button>
          {/if}
        {:else}
          <div class="aspect-[8/11] h-full">
            <Card type="item" color={card.color} isSelected={false} />
          </div>
        {/if}
      {/each}
    </section>
  </main>
{/if}
