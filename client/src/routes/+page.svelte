<script lang="ts">
  import { getPlayerData, setPlayerData } from '$lib/utils';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores.ts';
  import { onMount } from 'svelte';
  import type { Player } from '$lib/types';

  let player: Player = { name: '', credentials: '' };

  onMount((): void => {
    player = getPlayerData();
  });

  async function goToNewMatch(): Promise<void> {
    console.log('player in goToNewMatch', player);
    player = setPlayerData({ name: player.name, credentials: '' });
    const matchID = await createMatch();
    goto(`match/${matchID}`);
  }

  async function createMatch(): Promise<string> {
    try {
      const res = await $lobby.createMatch('hanamikoji', { numPlayers: 2 });
      return res.matchID;
    } catch (error) {
      throw new Error('Error creating match');
    }
  }
</script>

<main class="grid place-items-center h-screen">
  <form class="grid grid-rows-3 gap-2 w-64">
    <label for="nickname">Choose a nickname</label>
    <input
      id="nickname"
      type="text"
      name="nickname"
      placeholder="SpongeBob"
      class="border-2 w-full"
      bind:value={player.name}
    />
    <button class="border-2 w-full hover:cursor-pointer" on:click={goToNewMatch} disabled={!player.name}>New Match</button>
  </form>
</main>
