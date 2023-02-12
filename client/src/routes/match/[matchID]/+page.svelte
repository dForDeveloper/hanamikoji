<script lang="ts">
  import { maybeGetPlayerData, setPlayerData } from '$lib/local-storage';
  import Board from '$lib/components/Board.svelte';
  import { Client } from 'boardgame.io/client';
  import ErrorPage from '$lib/components/ErrorPage.svelte';
  import { Hanamikoji } from 'game-logic';
  import Loading from '$lib/components/Loading.svelte';
  import { PUBLIC_BASE_API_URL } from '$env/static/public';
  import { SocketIO } from 'boardgame.io/multiplayer';
  import { invalidateAll } from '$app/navigation';
  import { lobby } from '$lib/stores';
  import type { LobbyAPI } from 'boardgame.io';
  import type { Player } from '$lib/types';

  export let data: { matchID: string; match: LobbyAPI.Match };
  let player: Player = { name: '', credentials: '' };
  let client: ReturnType<typeof Client>;

  async function startClient(data: { matchID: string; match: LobbyAPI.Match }): Promise<boolean> {
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
        throw new Error('Match is full');
      }
    } else {
      playerID = getPlayerIdOfExistingPlayer();
    }

    client = Client({
      game: Hanamikoji,
      multiplayer: SocketIO({ server: PUBLIC_BASE_API_URL }),
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
    return matchPlayer!.id.toString();
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

{#await startClient(data)}
  <main class="grid place-items-center h-screen">
    <Loading size="150px" color="#c4b5fd" strokeWidth={5} />
  </main>
{:then}
  <Board {client} />
{:catch error}
  <ErrorPage status={403} errorMessage={error.message} />
{/await}
