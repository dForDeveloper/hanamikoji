<script lang="ts">
  // import { error } from '@sveltejs/kit';
  import { matches } from '$lib/stores.ts';
  import { Client } from 'boardgame.io/client';
  import { SocketIO } from 'boardgame.io/multiplayer';
  import { Hanamikoji } from 'game-logic';

  const client = Client({ game: Hanamikoji, multiplayer: SocketIO({ server: 'localhost:8000' }) });

  client.start();
</script>

<div>
  {#each $matches as { matchID }}
    <li>{matchID}</li>
  {/each}
</div>
