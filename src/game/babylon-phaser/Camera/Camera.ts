// camera/Camera.ts
import type { SceneContext } from "@babylonjs/lite";
import type { BaseCamera } from "./BaseCamera";
import { FpsCamera, type FpsOptions } from "./FpsCamera";
import type { FollowTarget } from "./MouseLook";
import {
  OrbitCamera,
  type FollowOptions,
  type OrbitOptions,
} from "./OrbitCamera";
import { TpsCamera, type TpsOptions } from "./TpsCamera";

/** Owns every camera in a scene and switches between them. */
export class Camera {
  private scene: SceneContext;
  private canvas: HTMLCanvasElement;
  private cameras = new Map<string, BaseCamera>();
  active: BaseCamera | null = null;

  constructor(scene: SceneContext, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
    // Default camera, so existing code using `camera.main` keeps working.
    this.addOrbit("main");
  }

  /** The active camera's underlying Babylon camera. */
  get main() {
    return this.active!.main;
  }

  // ---- adding cameras -------------------------------------------------

  /** Register any camera. The first one added becomes active. */
  add<T extends BaseCamera>(name: string, camera: T, makeActive = false): T {
    this.cameras.get(name)?.destroy();
    this.cameras.set(name, camera);
    if (!this.active || makeActive) this.switchTo(name);
    return camera;
  }

  addOrbit(name: string, options?: OrbitOptions, makeActive = false) {
    return this.add(
      name,
      new OrbitCamera(this.scene, this.canvas, options),
      makeActive,
    );
  }

  addFps(name: string, options?: FpsOptions, makeActive = false) {
    return this.add(
      name,
      new FpsCamera(this.scene, this.canvas, options),
      makeActive,
    );
  }

  addTps(name: string, options: TpsOptions, makeActive = false) {
    return this.add(
      name,
      new TpsCamera(this.scene, this.canvas, options),
      makeActive,
    );
  }

  // ---- managing cameras -----------------------------------------------

  get<T extends BaseCamera = BaseCamera>(name: string) {
    return this.cameras.get(name) as T | undefined;
  }

  switchTo(name: string) {
    const next = this.cameras.get(name);
    if (!next || next === this.active) return;
    this.active?.deactivate();
    this.active = next;
    next.activate();
  }

  remove(name: string) {
    const cam = this.cameras.get(name);
    if (!cam) return;
    if (cam === this.active) this.active = null;
    cam.destroy();
    this.cameras.delete(name);
  }

  /** Camera-relative move direction from the active camera. */
  moveDirection(x: number, y: number) {
    return this.active ? this.active.moveDirection(x, y) : { x: 0, z: 0 };
  }

  // ---- compatibility with the old API ---------------------------------

  attachControl(value: boolean) {
    if (this.active instanceof OrbitCamera) this.active.attachControl(value);
  }

  startFollow(target: FollowTarget, options?: FollowOptions) {
    if (this.active instanceof OrbitCamera) this.active.follow(target, options);
  }

  stopFollow() {
    if (this.active instanceof OrbitCamera) this.active.stopFollow();
  }

  // ---- frame loop -----------------------------------------------------

  /** Call every frame, after gameplay code has moved things. `delta` in ms. */
  update(delta: number) {
    this.active?.update(delta);
  }

  destroy() {
    for (const cam of this.cameras.values()) cam.destroy();
    this.cameras.clear();
    this.active = null;
  }
}
