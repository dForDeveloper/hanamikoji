import { readable, writable } from 'svelte/store';
import { LobbyClient } from 'boardgame.io/client';

const lobbyClient = new LobbyClient({ server: 'http://localhost:8000' });

export const lobby = readable(lobbyClient);
export const matches = writable([]);
