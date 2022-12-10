<script>
  import { Client } from 'boardgame.io/client';
  import { Hanamikoji } from 'game-logic';

  const client = Client({ game: Hanamikoji });

  client.start();
</script>
