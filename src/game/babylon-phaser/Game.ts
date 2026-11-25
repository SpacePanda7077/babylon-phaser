// babylon-phaser/Game.ts
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
  private current: Scene | null = null;
  // start() calls run one at a time, so quick calls can't overlap
  private queue: Promise<void> = Promise.resolve();

  constructor(
    config: GameConfig,
    engine: EngineContext,
    canvas: HTMLCanvasElement,
  ) {
    this.canvas = canvas;
    this.engine = engine;
    this.config = config;
  }

  /**
   * Stops the current scene and starts another.
   *
   * @param key - The `static key` of the scene class. Defaults to the first scene.
   * @returns Resolves when the new scene is ready to render.
   */
  start(key: string = this.config.scenes[0].key): Promise<void> {
    this.queue = this.queue
      .then(() => this.swap(key))
      .catch((e) => console.error(`Failed to start scene "${key}":`, e));
    return this.queue;
  }

  private async swap(key: string) {
    const SceneClass = this.config.scenes.find((s) => s.key === key);
    if (!SceneClass) throw new Error(`No scene with key "${key}"`);

    // Dispose the old scene before creating the new one
    if (this.current) {
      await this.current.dispose();
      this.current = null;
    }

    this.current = new SceneClass();
    await this.current.ready;
  }

  /** Disposes the running scene. Call before disposeEngine. */
  async destroy() {
    await this.queue;
    await this.current?.dispose();
    this.current = null;
  }
}
