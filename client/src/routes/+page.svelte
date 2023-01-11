<script lang="ts">
  import { getPlayerData, setPlayerData } from '$lib/local-storage';
  import NameForm from '$lib/components/NameForm.svelte';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import { onMount } from 'svelte';
  import type { Player } from '$lib/types';

  // const test = false;
  const test = true;
  // test client
  import { Client } from 'boardgame.io/client';
  import { Hanamikoji } from 'game-logic';
  import Board from '$lib/components/Board.svelte';
  const client = Client({ game: Hanamikoji, playerID: '0', debug: { collapseOnLoad: true } });
  client.start();
  // end test client

  let player: Player = { name: '', credentials: '' };

  onMount((): void => {
    player = getPlayerData();
  });

  async function handleClick(name: string): Promise<void> {
    try {
      player = setPlayerData({ name: name, credentials: '' });
      const { matchID } = await $lobby.createMatch('hanamikoji', { numPlayers: 2 });
      goto(`match/${matchID}`);
    } catch (error) {
      throw new Error('Error creating match');
    }
  }

  function getIsDisabled(name: string): boolean {
    return !name;
  }
</script>

<!-- TODO: remove test condition after UI implementation is complete -->
{#if test}
  <Board {client} />
{:else}
  <main class="grid place-items-center h-screen">
    <NameForm buttonText={'New Match'} {getIsDisabled} {handleClick} name={player.name} />
  </main>
{/if}
