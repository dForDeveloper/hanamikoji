<script lang="ts">
  import { getPlayerData, setPlayerData } from '$lib/utils';
  import NameForm from '$lib/components/NameForm.svelte';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import { onMount } from 'svelte';
  import type { Player } from '$lib/types';

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

<main class="grid place-items-center h-screen">
  <NameForm buttonText={'New Match'} getIsDisabled={getIsDisabled} handleClick={handleClick} name={player.name} />
</main>
