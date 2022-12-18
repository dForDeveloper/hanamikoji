import { LobbyClient } from 'boardgame.io/client';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

const lobbyClient = new LobbyClient({ server: PUBLIC_BASE_URL });

export const lobby: Readable<LobbyClient> = readable(lobbyClient);
