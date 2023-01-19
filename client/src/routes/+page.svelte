<script lang="ts">
  import { maybeGetPlayerData, setPlayerData } from '$lib/local-storage';
  import Loading from '$lib/components/Loading.svelte';
  import { goto } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import { onMount } from 'svelte';
  import type { Player } from '$lib/types';

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

<main class="h-screen bg-purple-100 font-nunito text-black/[.87] flex flex-col items-center gap-10 pt-10">
  <h1 class="text-4xl">Welcome to Hanamikoji</h1>
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
</main>
