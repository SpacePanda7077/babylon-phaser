import type { EngineContext } from "@babylonjs/lite";
import { Game, type GameConfig } from "./babylon-phaser/Game";
import { Game as MainGame } from "./scenes/Game";

const config: GameConfig = {
  width: "100%",
  height: "100%",
  scenes: [MainGame],
};

export const startGame = (engine: EngineContext, canvas: HTMLCanvasElement) => {
  const game = new Game(config, engine, canvas);
};
