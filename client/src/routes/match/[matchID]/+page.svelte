<script lang="ts">
  import { Client } from 'boardgame.io/client';
  import { SocketIO } from 'boardgame.io/multiplayer';
  import { Hanamikoji } from 'game-logic';
  import { invalidateAll } from '$app/navigation';
  import { getPlayerData, setPlayerData } from '$lib/utils';
  import type { Player } from '$lib/types';
  import { lobby } from '$lib/stores';
  import type { LobbyAPI } from 'boardgame.io';

  export let data: { matchID: string; match: LobbyAPI.Match };
  let player: Player = { name: '', credentials: '' };
  let client: Client;
  let startClientPromise: Promise<boolean> = startClient();

  async function startClient(): Promise<boolean> {
    const success = true;

    const hasPlayerSelectedName = player.name.length > 0;
    if (!hasPlayerSelectedName) {
      maybeGetPlayerDataFromLocalStorage();
    }

    const isPlayerDataInLocalStorage = player.name.length > 0;
    if (!isPlayerDataInLocalStorage) {
      return !success;
    }

    const playerNames = data.match.players.filter(matchPlayer => matchPlayer.name).map(matchPlayer => matchPlayer.name);

    const hasAlreadyJoined = playerNames.includes(player.name);
    const isMatchFull = playerNames.length === 2;
    let playerID: string = '';

    if (!hasAlreadyJoined) {
      if (!isMatchFull) {
        playerID = getPlayerIdOfNewPlayer(playerNames.length);
        await joinMatch(playerID);
      } else {
        throw new Error('Cannot join a full match');
      }
    } else {
      playerID = getPlayerIdOfExistingPlayer();
    }

    client = Client({
      game: Hanamikoji,
      multiplayer: SocketIO({ server: 'localhost:8000' }),
      matchID: data.match.matchID,
      credentials: player.credentials,
      playerID,
    });

    client.start();

    return success;
  }

  function maybeGetPlayerDataFromLocalStorage(): void {
    player = getPlayerData();
  }

  function getPlayerIdOfNewPlayer(playerCount): string {
    return playerCount === 0 ? '0' : '1';
  }

  function getPlayerIdOfExistingPlayer(): string {
    const matchPlayer = data.match.players.find(matchPlayer => matchPlayer.name === player.name);
    if (matchPlayer) {
      return matchPlayer.id.toString();
    } else {
      throw new Error('Player expected to be in match but was not');
    }
  }

  async function joinMatch(playerID): Promise<void> {
    try {
      const res: { playerCredentials: string } = await $lobby.joinMatch(
        'hanamikoji',
        data.matchID,
        { playerName: player.name, playerID }
      );
      player = setPlayerData({ name: player.name, credentials: res.playerCredentials });
      invalidateAll();
    } catch (error) {
      throw new Error('Error joining match');
    }
  }

  function handleClick(): void {
    startClientPromise = startClient();
  }

  function getIsButtonDisabled(playerName): boolean {
    console.log('invoked', playerName, !playerName);
    if (!playerName) return true;
    const foundPlayerName = data.match.players.find(matchPlayer => matchPlayer.name === playerName);
    return foundPlayerName !== undefined;
  }
</script>

<div>
  {#await startClientPromise}
    <p>joining match...</p>
  {:then success}
    {#if (success)}
      <p>match id: {client.matchID}</p>
      <p>player id: {client.playerID}</p>
      <p>player credentials: {client.credentials}</p>
    {:else}
      <input type="text" placeholder="Choose a nickname" bind:value={player.name}/>
      <button on:click={handleClick} disabled={getIsButtonDisabled(player.name)}>Join Match</button>
    {/if}
  {/await}
</div>
