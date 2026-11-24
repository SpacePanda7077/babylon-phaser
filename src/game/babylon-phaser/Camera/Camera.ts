import {
  attachControl,
  createArcRotateCamera,
  type ArcRotateCamera,
  type SceneContext,
} from "@babylonjs/lite";

export class Camera {
  babylon_scene: SceneContext;
  main: ArcRotateCamera;
  private canvas: HTMLCanvasElement;
  private detach: (() => void) | null = null;
  constructor(babylon_scene: SceneContext, canvas: HTMLCanvasElement) {
    this.babylon_scene = babylon_scene;
    this.canvas = canvas;
    this.main = createArcRotateCamera(-Math.PI / 2, Math.PI / 2.5, 4, {
      x: 0,
      y: 0,
      z: 0,
    });
    this.babylon_scene.camera = this.main;
  }

  attachControl(value: boolean) {
    if (value) {
      this.detach?.();
      this.detach = attachControl(this.main, this.canvas, this.babylon_scene);
    } else {
      this.detach?.();
      this.detach = null;
    }
  }
}
