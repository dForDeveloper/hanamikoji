import type { LoadEvent } from '@sveltejs/kit';
import type { LobbyAPI } from 'boardgame.io';

export async function load(loadEvent: LoadEvent) {
  const fetchMatchById = async () => {
    const { matchID } = loadEvent.params;
    const res = await loadEvent.fetch(`http://localhost:8000/games/hanamikoji/${matchID}`);
    const match: LobbyAPI.Match = await res.json();
    return match;
  };
  return { match: fetchMatchById(), matchID: loadEvent.params.matchID };
}
