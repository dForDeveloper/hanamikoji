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

<div>
  <input type="text" placeholder="Choose a nickname" bind:value={player.name} />
  <button on:click={goToNewMatch} disabled={!player.name}>New Match</button>
</div>
