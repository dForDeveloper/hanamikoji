<script lang="ts">
  import { goto } from '$app/navigation';
  import { lobby, matches } from '$lib/stores.ts';
  import { nanoid } from 'nanoid';

  async function getMatches() {
    try {
      const res = await $lobby.listMatches('hanamikoji');

      if (res.matches) {
        $matches = res.matches;
      }
    } catch (error) {
      throw new Error('Error loading matches. ' + error);
    }
  }

  async function createMatch() {
    try {
      const res = await $lobby.createMatch('hanamikoji', { numPlayers: 2 });

      if (res.matchID) {
        await getMatches();
      }
    } catch (error) {
      throw new Error('Error creating match. ' + error);
    }
  }

  async function joinMatch(matchID: string) {
    console.log({ matchID });
    try {
      const res = await $lobby.joinMatch('hanamikoji', matchID, { playerName: nanoid() });
      console.log({ res });

      if (res.playerCredentials) {
        goto(`game/${matchID}`);
      }
    } catch (error) {
      throw new Error('Error joining match. ' + error);
    }
  }
</script>

<div>
  <button on:click={createMatch}>Create Match</button>
  <div>
    <h3>Matches:</h3>
    {#await getMatches()}
      <p>Loading matches...</p>
    {:then res}
      {#if $matches.length}
        <ul>
          {#each $matches as { matchID }}
            <li on:click={() => joinMatch(matchID)}>{matchID}</li>
          {/each}
        </ul>
      {:else}
        <p>No current matches</p>
      {/if}
    {/await}
  </div>
</div>
