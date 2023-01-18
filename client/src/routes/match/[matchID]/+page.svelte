<script lang="ts">
  import { maybeGetPlayerData, setPlayerData } from '$lib/local-storage';
  import Board from '$lib/components/Board.svelte';
  import { Client } from 'boardgame.io/client';
  import { Hanamikoji } from 'game-logic';
  import Loading from '$lib/components/Loading.svelte';
  import { SocketIO } from 'boardgame.io/multiplayer';
  import { error } from '@sveltejs/kit';
  import { invalidateAll } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import type { LobbyAPI } from 'boardgame.io';
  import type { Player } from '$lib/types';

  export let data: { matchID: string; match: LobbyAPI.Match };
  let player: Player = { name: '', credentials: '' };
  let client: any;
  let startClientPromise: Promise<boolean> = startClient();

  async function startClient(): Promise<boolean> {
    player = maybeGetPlayerData();

    if (!player.name) {
      player = setPlayerData({ name: crypto.randomUUID(), credentials: '' });
    }

    const existingPlayerNames: string[] = data.match.players
      .filter((matchPlayer) => matchPlayer.name)
      .map((matchPlayer) => matchPlayer.name!);

    const hasAlreadyJoined: boolean = existingPlayerNames.includes(player.name);
    const isMatchFull: boolean = existingPlayerNames.length === 2;
    let playerID = '';

    if (!hasAlreadyJoined) {
      if (!isMatchFull) {
        playerID = getPlayerIdOfNewPlayer(existingPlayerNames.length);
        await joinMatch(playerID);
      } else {
        // TODO: test this case
        throw error(403, { message: 'Cannot join a full match' });
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
      debug: { collapseOnLoad: true },
    });

    client.start();

    return true;
  }

  function getPlayerIdOfNewPlayer(playerCount: number): string {
    return playerCount === 0 ? '0' : '1';
  }

  function getPlayerIdOfExistingPlayer(): string {
    const matchPlayer = data.match.players.find((matchPlayer) => matchPlayer.name === player.name);
    if (matchPlayer) {
      return matchPlayer.id.toString();
    } else {
      throw new Error('Error finding player');
    }
  }

  async function joinMatch(playerID: string): Promise<void> {
    try {
      const res: { playerCredentials: string } = await $lobby.joinMatch('hanamikoji', data.matchID, {
        playerName: player.name,
        playerID,
      });
      player = setPlayerData({ name: player.name, credentials: res.playerCredentials });
      invalidateAll();
    } catch (error) {
      throw new Error('Error joining match');
    }
  }
</script>

{#await startClientPromise}
  <main class="grid place-items-center h-screen bg-purple-100">
    <Loading size="150px" color="#c4b5fd" strokeWidth={5} />
  </main>
{:then success}
  {#if success}
    <Board {client} />
  {:else}
    <main class="grid place-items-center h-screen bg-purple-100 text-black/[.87]">
      <p>error</p>
    </main>
  {/if}
{/await}
