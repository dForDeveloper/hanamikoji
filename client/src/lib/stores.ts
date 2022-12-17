import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { LobbyClient } from 'boardgame.io/client';

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });

export const lobby: Readable<LobbyClient> = readable(lobbyClient);
