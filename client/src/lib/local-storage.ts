import type { Player } from '$lib/types';

const LOCAL_STORAGE_KEY = 'hanamikojiPlayerData';

export const getPlayerData = (): Player => {
  const item = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (item) {
    return JSON.parse(item);
  }
  return { name: '', credentials: '' };
};

export const setPlayerData = (player: Player): Player => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(player));
  return player;
};
