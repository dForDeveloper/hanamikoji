<script>
  import { Client } from 'boardgame.io/client';
  import { Hanamikoji } from '$lib/Game';

  const client = Client({ game: Hanamikoji });

  client.start();
</script>
