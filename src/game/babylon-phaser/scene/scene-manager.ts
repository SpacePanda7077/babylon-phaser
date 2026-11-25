// babylon-phaser/scene/SceneManager.ts
import type { Game } from "../Game";

/** What a scene sees as `this.scene`. */
export class SceneManager {
  private game: Game;
  private key: string;
  private switching: Promise<void> | null = null;

  constructor(game: Game, key: string) {
    this.game = game;
    this.key = key;
  }

  /**
   * Stops this scene and starts another.
   *
   * @param key - The `static key` of the scene to start.
   * @returns Resolves when the new scene is ready. Calls made while a switch
   * is already running return that same promise instead of queuing another.
   *
   * @example
   * ```ts
   * this.scene.start("Menu");
   * ```
   */
  start(key: string): Promise<void> {
    this.switching ??= this.game.start(key).finally(() => {
      this.switching = null;
    });
    return this.switching;
  }

  /** Stops this scene and starts it again from scratch. */
  restart(): Promise<void> {
    return this.start(this.key);
  }
}
