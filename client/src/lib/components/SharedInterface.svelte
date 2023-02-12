<script lang="ts">
  import AcknowledgeChoice from '$lib/components/AcknowledgeChoice.svelte';
  import AcknowledgeReveal from '$lib/components/AcknowledgeReveal.svelte';
  import Actions from '$lib/components/Actions.svelte';
  import Button from '$lib/components/Button.svelte';
  import Deck from '$lib/components/Deck.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import PresentedCardAreaActivePlayer from '$lib/components/PresentedCardAreaActivePlayer.svelte';
  import PresentedCardAreaNonactivePlayer from '$lib/components/PresentedCardAreaNonactivePlayer.svelte';
  import SelectedCardAreaActivePlayer from '$lib/components/SelectedCardAreaActivePlayer.svelte';
  import SelectedCardAreaNonactivePlayer from '$lib/components/SelectedCardAreaNonactivePlayer.svelte';
  import ShareableLink from '$lib/components/ShareableLink.svelte';
  import { Stage } from 'game-logic';
  import { getInstructions } from '$lib/instruction-messages';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import { maybeGetPlayerData } from '$lib/local-storage';
  import type { Action, GameState, ItemCard, Player } from 'game-logic';
  import type { SelectedCard } from '$lib/types';

  export let G: GameState;
  export let hasGameStarted: boolean;
  export let matchID: string;
  export let playerID: string;
  export let opponentID: string;
  export let playerStage: Stage;
  export let opponentStage: Stage;
  export let currentAction: string;
  export let selectedCards: SelectedCard[];
  export let selectedFromPresented: string;
  export let winnerID: string;
  export let getPlayer: (G: GameState, id: string) => Player;
  export let drawCard: () => void;
  export let undoAction: () => void;
  export let selectCardsAsCurrent: (selectedIndexes: string[]) => void;
  export let selectCardsAsOpposing: (selectedIndex: string) => void;
  export let acknowledgeChoice: () => void;
  export let acknowledgeReveal: () => void;
  export let calculateScore: () => void;
  export let selectAction: (actionIndex: string) => void;
  export let revealHiddenCard: () => void;
  export let readyUp: () => void;
  export let setSelectedFromPresented: (updatedPresentedSelection: string) => void;
  let isLoading = false;

  function confirmSelection(selectedCards: SelectedCard[], selectedFromPresented: string, playerStage: Stage): void {
    if (playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER) {
      const selectedCardIndexes = selectedCards
        .filter((maybeCard) => maybeCard !== null)
        .map((itemCard) => itemCard!.index.toString());
      selectCardsAsCurrent(selectedCardIndexes);
    } else if (playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER) {
      selectCardsAsOpposing(selectedFromPresented);
    }
  }

  function getIsConfirmationButtonDisabled(
    selectedCards: SelectedCard[],
    selectedFromPresented: string,
    playerStage: Stage,
  ): boolean {
    if (playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER) {
      const requiredSelectedCardCount = Number(currentAction) + 1;
      const nonNullSelectedCardCount = selectedCards.filter((maybeCard) => maybeCard !== null).length;
      return nonNullSelectedCardCount !== requiredSelectedCardCount;
    } else if (playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER) {
      return selectedFromPresented === '';
    } else {
      throw new Error('Confirmation button should not exist');
    }
  }

  function getPresentedCards(G: GameState): ItemCard[] {
    return G.presentedCards;
  }

  function getOpponentChoice(G: GameState): string {
    return G.opponentChoice;
  }

  function getRevealedCard(G: GameState): ItemCard {
    if (!G.revealedCard) {
      throw new Error('Revealed card should exist');
    }
    return G.revealedCard;
  }

  function getIsActionUndoable(G: GameState, id: string): boolean {
    const player = getPlayer(G, id);
    return Object.values(player.actions).some((action: Action) => action.enabled);
  }

  function getScoreMessages(G: GameState, playerID: string, opponentID: string, winnerID: string): string[] {
    const playerScore = getPlayer(G, playerID).score;
    const opponentScore = getPlayer(G, opponentID).score;
    const messages = [
      `You have ${playerScore.geishaCount} Geisha and ${playerScore.charmPoints} Charm Points.`,
      `They have ${opponentScore.geishaCount} Geisha and ${opponentScore.charmPoints} Charm Points.`,
    ];
    if (winnerID === playerID) {
      messages.push('You win! 🎉');
    } else if (winnerID === opponentID) {
      messages.push('You lose. 😞');
    } else {
      messages.push("Nobody's won yet. Ready for the next round?");
    }
    return messages;
  }

  async function startRematch(): Promise<void> {
    try {
      isLoading = true;
      const { credentials } = maybeGetPlayerData();
      const { nextMatchID } = await $lobby.playAgain('hanamikoji', matchID, { playerID, credentials });
      goto(`${nextMatchID}`, { invalidateAll: true });
    } catch (error) {
      isLoading = false;
      throw new Error('Error creating match');
    }
  }
</script>

{#if hasGameStarted}
  {#if playerStage === Stage.ACKNOWLEDGE_CHOICE || opponentStage === Stage.ACKNOWLEDGE_CHOICE}
    <AcknowledgeChoice
      presentedCards={getPresentedCards(G)}
      opponentChoice={getOpponentChoice(G)}
      {playerStage}
      {opponentStage}
      {currentAction}
      {acknowledgeChoice}
    />
  {:else if playerStage === Stage.ACKNOWLEDGE_REVEAL || opponentStage === Stage.ACKNOWLEDGE_REVEAL}
    <AcknowledgeReveal
      revealedCard={getRevealedCard(G)}
      {playerStage}
      {opponentStage}
      {currentAction}
      {acknowledgeReveal}
    />
  {:else}
    <section
      aria-label="game-interface"
      class="grid grid-rows-[1fr_7.03rem_6rem] lg:grid-rows-[1fr_13.77vh_1fr] xl:grid-rows-[1fr_16.2vh_1fr]"
    >
      <div aria-label="instruction" class="place-self-center h-full max-w-[65%] md:max-w-[75%] lg:max-w-prose">
        {#if playerStage === Stage.PREPARE_NEXT_ROUND || winnerID}
          {#each getScoreMessages(G, playerID, opponentID, winnerID) as message}
            <p class="message-text">{message}</p>
          {/each}
        {:else}
          {#each getInstructions(currentAction, playerStage, opponentStage) as instruction}
            <p class="message-text">{instruction}</p>
          {/each}
        {/if}
      </div>
      {#if playerStage === Stage.SELECT_ACTION}
        <div class="lg:hidden">
          <Actions player={getPlayer(G, playerID)} {playerStage} {selectAction} {revealHiddenCard} />
        </div>
      {:else}
        <div aria-label="selected-card-area" class="flex flex-row justify-center space-x-2">
          {#if playerStage === Stage.DRAW || opponentStage === Stage.DRAW}
            <Deck handleClick={() => drawCard()} isDisabled={playerStage !== Stage.DRAW} />
          {:else if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER}
            <SelectedCardAreaActivePlayer {currentAction} {selectedCards} />
          {:else if playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER}
            <PresentedCardAreaActivePlayer
              presentedCards={getPresentedCards(G)}
              {currentAction}
              {selectedFromPresented}
              {setSelectedFromPresented}
            />
          {:else if opponentStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER}
            <SelectedCardAreaNonactivePlayer {currentAction} />
          {:else if opponentStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER}
            <PresentedCardAreaNonactivePlayer {G} {currentAction} {getPresentedCards} />
          {:else if playerStage === Stage.CALCULATE && !winnerID}
            <Button handleClick={calculateScore} extraClasses="self-center">calculate</Button>
          {:else if playerStage === Stage.PREPARE_NEXT_ROUND}
            <Button handleClick={readyUp} extraClasses="self-center">ready</Button>
          {:else if winnerID}
            <Button handleClick={startRematch} getIsDisabled={() => isLoading} extraClasses="self-center">
              {#if isLoading}
              <Loading size="28px" color="rgba(0,0,0,0.5)" strokeWidth={9} />
            {:else}
              <span>rematch</span>
            {/if}
            </Button>
          {/if}
        </div>
      {/if}
      <div class="flex justify-center gap-8 self-center lg:self-start lg:pt-10">
        {#if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER && getIsActionUndoable(G, playerID)}
          <Button handleClick={undoAction} isSecondary={true}>undo</Button>
        {/if}
        {#if playerStage === Stage.SELECT_CARDS_AS_ACTIVE_PLAYER || playerStage === Stage.SELECT_CARDS_AS_NONACTIVE_PLAYER}
          <button
            on:click={() => confirmSelection(selectedCards, selectedFromPresented, playerStage)}
            disabled={getIsConfirmationButtonDisabled(selectedCards, selectedFromPresented, playerStage)}
            class="bg-violet-300 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:bg-gray-300 disabled:shadow-none h-10 w-28 text-lg fhd:h-12 fhd:w-32 fhd:text-xl"
          >
            confirm
          </button>
        {/if}
      </div>
    </section>
  {/if}
{:else}
  <section class="grid grid-rows-[1fr_7.03rem_6rem] lg:grid-rows-[1fr_13.77vh_1fr] xl:grid-rows-[1fr_16.2vh_1fr]">
    <ShareableLink {matchID} />
    <div class="flex flex-row justify-center space-x-2">
      <Deck handleClick={() => false} isDisabled={true} />
    </div>
  </section>
{/if}
