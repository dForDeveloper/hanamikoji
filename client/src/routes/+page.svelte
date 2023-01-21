<script lang="ts">
  import { maybeGetPlayerData, setPlayerData } from '$lib/local-storage';
  import Card from '$lib/components/Card.svelte';
  import { Color } from 'game-logic';
  import Loading from '$lib/components/Loading.svelte';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import { onMount } from 'svelte';
  import type { Player } from '$lib/types';
  import ActionMarker from '$lib/components/ActionMarker.svelte';

  let player: Player = { name: '', credentials: '' };
  let isLoading = false;

  onMount((): void => {
    player = maybeGetPlayerData();
  });

  async function startMatch(): Promise<void> {
    try {
      isLoading = true;
      if (!player.name) {
        player = setPlayerData({ name: crypto.randomUUID(), credentials: '' });
      }
      const { matchID } = await $lobby.createMatch('hanamikoji', { numPlayers: 2 });
      goto(`match/${matchID}`);
    } catch (error) {
      isLoading = false;
      throw new Error('Error creating match');
    }
  }
</script>

<main class="bg-purple-100 font-nunito text-black/[.87] flex flex-col items-center gap-10 pt-10 pb-60">
  <h1 class="text-4xl">Welcome to Hanamikoji</h1>
  <p class="max-w-prose">
    In Hanamikoji, two players compete to earn the favor of seven Geisha by collecting the performance items the Geisha
    desire.
  </p>
  <button
    on:click={() => startMatch()}
    disabled={isLoading}
    class="bg-violet-300 text-xl h-12 w-40 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:cursor-wait"
  >
    {#if isLoading}
      <Loading size="28px" color="rgba(0,0,0,0.5)" strokeWidth={9} />
    {:else}
      <span>create match</span>
    {/if}
  </button>
  <h2 class="text-3xl pt-12">How to Play</h2>
  <section class="max-w-prose pb-2">
    <h3 class="text-2xl">Summary:</h3>
    <div class="flex flex-col gap-2 pt-1">
      <p>
        The object of the game is to win the favor of 4 Geisha or to have 11 Charm Points. (There is a maximum of 7
        Geisha and 21 Charm Points.)
      </p>
      <p>You and your opponent take turns performing actions in order to play Item Cards.</p>
      <p>
        At the end of a round, for each Geisha, if you have more Item Cards of the corresponding type than your
        opponent, you win the Geisha's favor and gain Charm Points equal to the number on the Geisha Card.
      </p>
      <p>The game continues until one player achieves a winning score at the end of a round.</p>
    </div>
  </section>
  <section class="max-w-prose pb-2">
    <h3 class="text-2xl">Card Details:</h3>
    <div class="flex flex-col gap-6 pt-1">
      <div class="grid grid-cols-[13.31vh_1fr]">
        <h4 class="justify-self-center">Geisha Card</h4>
        <div class="row-start-2">
          <Card type="geisha" color={Color.BLUE} />
        </div>
        <div class="flex flex-col gap-2 pl-6 row-start-2">
          <p>The number on the Geisha Card represents how many Charm Points it's worth.</p>
          <p>The circular token in the center of the Geisha Card is a Victory Marker.</p>
          <p>
            The Victory Marker begins in the neutral center position and represents which way the Geisha's favor leans.
          </p>
          <p>
            In the scoring phase, the Victory Marker can move either to the top or to the bottom of the card
            representing that either your opponent or you have won the Geisha's favor.
          </p>
        </div>
      </div>
      <div class="grid grid-cols-[13.31vh_1fr]">
        <div class="grid w-[11.53vh]">
          <h4 class="justify-self-center">Item Card</h4>
        </div>
        <div class="row-start-2">
          <Card type="item" color={Color.BLUE} />
        </div>
        <div class="flex flex-col gap-2 pl-6 row-start-2">
          <p>The number on the Item Card represents how many of that card are in the game.</p>
          <p>
            Each Geisha's corresponding Item Cards share the Geisha's number and color. The item depicted in the card
            arts also match.
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="max-w-prose pb-2">
    <h3 class="text-2xl">Game Setup:</h3>
    <div class="flex flex-col gap-2 pt-1">
      <p>7 Geisha Cards in the center of the board</p>
      <p>1 Victory Marker on the center of each Geisha Card</p>
      <p>
        A deck of 20 Item Cards (There are 21 Item Cards in total, but one Item Card is removed from the deck at random
        at the beginning of each round.)
      </p>
      <p>A hand of 6 Item Cards for each player dealt from the deck</p>
      <p>4 Action Markers for each player</p>
    </div>
  </section>
  <section class="max-w-prose pb-2">
    <h3 class="text-2xl">Player Turns:</h3>
    <div class="flex flex-col gap-2 pt-1">
      <p>Players alternate taking turns.</p>
      <p>On a player's turn they must draw a card from the deck of Item Cards and then perform one action.</p>
      <p>There are 4 different actions.</p>
      <p>Each player will have 4 turns and must perform each action once.</p>
      <p>Actions can be performed in any order.</p>
    </div>
  </section>
  <secion class="max-w-prose pb-2">
    <h3 class="text-2xl">Actions:</h3>
    <div class="flex flex-col gap-6 pt-1">
      <div class="grid grid-cols-[8vh_1fr]">
        <h4 class="justify-self-center">Action 1</h4>
        <div class="row-start-2">
          <ActionMarker index={1} isEnabled={true} isHoverable={false} />
        </div>
        <ul class="pl-6 row-start-2">
          <li class="pb-2">Choose 1 card from your hand.</li>
          <li class="pb-2">This card will be hidden from your opponent.</li>
          <li>At the end of the round you will reveal and play this card.</li>
        </ul>
      </div>
      <div class="grid grid-cols-[8vh_1fr]">
        <h4 class="justify-self-center">Action 2</h4>
        <div class="row-start-2">
          <ActionMarker index={2} isEnabled={true} isHoverable={false} />
        </div>
        <ul class="pl-6 row-start-2">
          <li class="pb-2">Choose 2 cards from your hand.</li>
          <li>These cards will be hidden from your opponent and won't be played this round.</li>
        </ul>
      </div>
      <div class="grid grid-cols-[8vh_1fr]">
        <h4 class="justify-self-center">Action 3</h4>
        <div class="row-start-2">
          <ActionMarker index={3} isEnabled={true} isHoverable={false} />
        </div>
        <ul class="pl-6 row-start-2">
          <li class="pb-2">Choose 3 cards from your hand to reveal to your opponent.</li>
          <li class="pb-2">They will choose one of the cards to play.</li>
          <li>You will play the remaining two cards.</li>
        </ul>
      </div>
      <div class="grid grid-cols-[8vh_1fr]">
        <h4 class="justify-self-center">Action 4</h4>
        <div class="row-start-2">
          <ActionMarker index={4} isEnabled={true} isHoverable={false} />
        </div>
        <ul class="pl-6 row-start-2">
          <li class="pb-2">Choose 4 cards from your hand separated into two sets of two to reveal to your opponent.</li>
          <li class="pb-2">They will choose one set to play.</li>
          <li>You will play the remaining set.</li>
        </ul>
      </div>
    </div>
  </secion>
  <section class="max-w-prose pb-2">
    <h3 class="text-2xl">Scoring:</h3>
    <div class="flex flex-col gap-2 pt-1">
      <p>After both players have performed 4 actions, each player reveals and plays their hidden card from Action 1.</p>
      <p>
        Then for each Geisha, compare the number of Item Cards each player has played on their side of the board. If one
        player has more Item Cards, move the Victory Marker for that Geisha to that player's side.
      </p>
      <p>
        A Victory Marker on a player's side means that that player wins the Geisha and gains Charm Points equal to the
        number on the Geisha Card.
      </p>
      <p>
        After determining the position of each Victory Marker, calculate the number of Geisha and Charm Points each
        player has.
      </p>
      <p>If no player has won, reset the deck and start another round.</p>
      <p>
        Keep in mind that Victory Markers remain in place, so during the next round's scoring phase, a player will win a
        Geisha if the Victory Marker is already on that player's side and the number of Item Cards is tied.
      </p>
    </div>
  </section>
  <section class="max-w-prose pb-2">
    <h3 class="text-2xl">Winning the Game:</h3>
    <div class="flex flex-col gap-2 pt-1">
      <p>If any player wins 4 Geisha or has 11 or more Charm Points, that player wins the game.</p>
      <p>
        If one player wins 4 Geisha and the other has 11 or more Charm Points, the player with 11 or more Charm Points
        wins the game.
      </p>
    </div>
  </section>
</main>
