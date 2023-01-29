import { error } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import type { LobbyAPI } from 'boardgame.io';
import { PUBLIC_BASE_API_URL } from '$env/static/public';

export async function load(loadEvent: LoadEvent) {
  const fetchMatchById = async () => {
    try {
      const { matchID } = loadEvent.params;
      const res = await loadEvent.fetch(`${PUBLIC_BASE_API_URL}/games/hanamikoji/${matchID}`);
      const match: LobbyAPI.Match = await res.json();
      return match;
    } catch (err) {
      throw error(404, { message: 'Match does not exist' });
    }
  };
  return { match: fetchMatchById(), matchID: loadEvent.params.matchID };
}
