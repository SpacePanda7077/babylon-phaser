// main.ts
import type { EngineContext } from "@babylonjs/lite";
import { Game, type GameConfig } from "./babylon-phaser/Game";
import { setGame } from "./babylon-phaser/game-context";
import { Game as MainGame } from "./scenes/Game";
import { Menu } from "./scenes/Menu";

const config: GameConfig = {
  width: "100%",
  height: "100%",
  scenes: [Menu, MainGame],
};

export const startGame = async (
  engine: EngineContext,
  canvas: HTMLCanvasElement,
) => {
  const game = new Game(config, engine, canvas);
  setGame(game); // must be set before any Scene is constructed
  await game.start();
  return game;
};

export const stopGame = async (game: Game) => {
  await game.destroy();
  setGame(null);
};
