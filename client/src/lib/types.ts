import type { ItemCard } from 'game-logic';

export type Player = {
  name: string;
  credentials: string;
};

export type SelectedCard = (ItemCard & { index: number }) | null;
