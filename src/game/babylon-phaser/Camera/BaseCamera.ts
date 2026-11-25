// camera/BaseCamera.ts
import type { ArcRotateCamera, SceneContext } from "@babylonjs/lite";
import type { Vec3 } from "./MouseLook";

export type MoveDir = { x: number; z: number };

export abstract class BaseCamera {
  protected scene: SceneContext;
  protected canvas: HTMLCanvasElement;
  main: ArcRotateCamera;

  constructor(
    scene: SceneContext,
    canvas: HTMLCanvasElement,
    main: ArcRotateCamera,
  ) {
    this.scene = scene;
    this.canvas = canvas;
    this.main = main;
  }

  /** Flat (ground-plane) direction the camera faces. */
  get forward(): Vec3 {
    // ArcRotate sits at target + (cos a, sin a) * r, so it looks along -(cos a, sin a)
    const x = -Math.cos(this.main.alpha);
    const z = -Math.sin(this.main.alpha);
    const len = Math.hypot(x, z) || 1;
    return { x: x / len, y: 0, z: z / len };
  }

  /** Flat direction to the camera's right. */
  get right(): Vec3 {
    const f = this.forward;
    return { x: f.z, y: 0, z: -f.x };
  }

  /**
   * Turn raw input into a camera-relative world direction.
   * @param x strafe input  (-1 left ... 1 right)
   * @param y forward input (-1 back ... 1 forward)
   * @returns {x, z} with length 0..1. Diagonals are already normalized.
   */
  moveDirection(x: number, y: number): MoveDir {
    const f = this.forward;
    const r = this.right;

    let dx = f.x * y + r.x * x;
    let dz = f.z * y + r.z * x;

    // Clamp to length 1 (keeps partial joystick tilt, stops fast diagonals)
    const len = Math.hypot(dx, dz);
    if (len > 1) {
      dx /= len;
      dz /= len;
    }
    return { x: dx, z: dz };
  }

  /** Make this the scene's active camera. */
  activate() {
    this.scene.camera = this.main;
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }

  /** Call every frame, after the followed mesh has moved. `delta` is in ms. */
  abstract update(delta: number): void;

  destroy() {
    this.deactivate();
  }

  protected onActivate() {}
  protected onDeactivate() {}
}

/** Frame-rate independent smoothing factor. speed 0 = snap instantly. */
export function smoothFactor(speed: number, deltaMs: number) {
  return speed <= 0 ? 1 : 1 - Math.exp(-speed * (deltaMs / 1000));
}
