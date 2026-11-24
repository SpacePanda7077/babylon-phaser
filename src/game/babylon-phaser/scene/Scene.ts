// babylon-phaser/scene/Scene.ts
import {
  disposeScene,
  registerScene,
  type EngineContext,
  type SceneContext,
} from "@babylonjs/lite";
import { BabylonScene } from "../babylon-scene/Babylon-Scene";
import { Camera } from "../Camera/Camera";
import { Light } from "../Light/Light";
import { Add } from "../add/Add";
import { game } from "../../main";

export class Scene {
  protected canvas: HTMLCanvasElement;
  protected engine: EngineContext;
  protected babylon_scene: SceneContext;
  protected camera: Camera;
  protected light: Light;
  ready: Promise<void>;
  add: Add;
  static key: String;

  constructor() {
    this.canvas = game.canvas;
    this.engine = game.engine;
    this.babylon_scene = new BabylonScene(this.engine).babylon_scene;
    this.camera = new Camera(this.babylon_scene, this.canvas);
    this.light = new Light(this.babylon_scene, this.engine);
    this.add = new Add(this.babylon_scene, this.engine);
    this.ready = this.boot();
  }

  private async boot() {
    try {
      await this.preload();
      await this.create();
      await registerScene(this.babylon_scene); // after everything is added
    } catch (e) {
      console.error("Scene boot failed:", e);
    }
  }

  dispose() {
    this.camera.attachControl(false);
    disposeScene(this.babylon_scene);
  }

  async preload() {}
  async create() {}
  update(delta: number): void {}
}
