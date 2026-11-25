// babylon-phaser/scene/Scene.ts
import {
  disposeScene,
  onBeforeRender,
  registerScene,
  stopEngine,
  unregisterScene,
  type EngineContext,
  type SceneContext,
} from "@babylonjs/lite";
import { BabylonScene } from "../babylon-scene/Babylon-Scene";
import { Camera } from "../Camera/Camera";
import { Light } from "../Light/Light";
import { Add } from "../add/Add";
import { getGame } from "../game-context";
import type { Game } from "../Game";
import { SceneManager } from "./scene-manager";
import { Input } from "../input/Input";

export class Scene {
  /** Name used with this.scene.start("Menu"). Override in each subclass. */
  static key = "";

  protected canvas: HTMLCanvasElement;
  protected engine: EngineContext;
  protected babylon_scene: SceneContext;
  protected camera: Camera;
  protected light: Light;
  game: Game;
  /** Switch scenes: this.scene.start("Other") or this.scene.restart(). */
  scene: SceneManager;
  add: Add;
  ready: Promise<void>;
  input: Input;

  constructor() {
    this.game = getGame();
    this.scene = new SceneManager(
      this.game,
      (this.constructor as typeof Scene).key, // this scene's own key, for restart()
    );
    this.canvas = this.game.canvas;
    this.engine = this.game.engine;
    this.babylon_scene = new BabylonScene(this.engine).babylon_scene;
    this.camera = new Camera(this.babylon_scene, this.canvas);
    this.light = new Light(this.babylon_scene, this.engine);
    this.add = new Add(this.babylon_scene, this.engine);
    this.input = new Input();
    this.ready = this.boot();
    onBeforeRender(this.babylon_scene, (deltaMs: number) => {
      if (!this.ready) return;
      this.input.update(deltaMs);
      this.update(deltaMs);
    });
  }

  private async boot() {
    try {
      // Let the subclass constructor finish (its fields are set after super())
      // before preload() and create() run.
      await Promise.resolve();
      await this.preload();
      await this.create();
      await registerScene(this.babylon_scene); // after everything is added
    } catch (e) {
      // Swallow errors so `ready` always resolves and start() can't hang
      console.error("Scene boot failed:", e);
    }
  }

  /** Tears down everything this scene created. */
  async dispose() {
    await this.ready; // don't dispose while preload/create is still running
    this.input.destroy();
    this.camera.attachControl(false);
    // If you use light gizmos, call this.light.removeLightGizmos() here too.
    unregisterScene(this.babylon_scene);
    disposeScene(this.babylon_scene);
  }

  async preload() {}
  async create() {}
  update(delta: number): void {}
}
