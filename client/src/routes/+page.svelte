<script lang="ts">
  import { getPlayerData, setPlayerData } from '$lib/utils';
  import NameForm from '$lib/components/NameForm.svelte';
  import { error } from '@sveltejs/kit';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import { onMount } from 'svelte';
  import type { Player } from '$lib/types';

  let player: Player = { name: '', credentials: '' };

  onMount((): void => {
    player = getPlayerData();
  });

  async function handleClick(event: CustomEvent): Promise<void> {
    try {
      setPlayerData({ name: event.detail.name, credentials: '' });
      const { matchID } = await $lobby.createMatch('hanamikoji', { numPlayers: 2 });
      goto(`match/${matchID}`);
    } catch (err) {
      throw error(500, { message: 'Error creating match' });
    }
  }

  function getIsDisabled(name: string): boolean {
    return !name;
  }
</script>

<main class="grid place-items-center h-screen">
  <NameForm on:clickEvent={handleClick} getIsDisabled={getIsDisabled} name={player.name} />
</main>
