import type { EngineContext } from "@babylonjs/lite";
import type { Scene } from "./scene/Scene";

export type GameConfig = {
  width: string;
  height: string;
  scenes: (typeof Scene)[];
};

export class Game {
  canvas: HTMLCanvasElement;
  engine: EngineContext;
  config: GameConfig;
  constructor(
    config: GameConfig,
    engine: EngineContext,
    canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
    this.engine = engine;
    this.config = config;
    // this.start(engine, canvas);
  }
  start() {
    const first_scene = new this.config.scenes[0]();
  }
}
