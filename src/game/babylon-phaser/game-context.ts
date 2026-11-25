// babylon-phaser/game-context.ts
import type { Game } from "./Game";

let current: Game | null = null;

export const setGame = (game: Game | null) => {
  current = game;
};

export const getGame = (): Game => {
  if (!current) throw new Error("No game is running");
  return current;
};
