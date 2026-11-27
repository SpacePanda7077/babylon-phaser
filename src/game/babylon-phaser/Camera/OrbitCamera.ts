// camera/OrbitCamera.ts
import {
  attachControl,
  createArcRotateCamera,
  type SceneContext,
  type Vec3,
} from "@babylonjs/lite";
import { BaseCamera, smoothFactor } from "./BaseCamera";
import { resolveTarget, type Followable, type FollowTarget } from "./MouseLook";

export type OrbitOptions = {
  alpha?: number;
  beta?: number;
  radius?: number;
  target?: Partial<Vec3>;
};

export type FollowOptions = {
  radius?: number;
  /** World-space offset of the look-at point from the target's position. */
  offset?: Partial<Vec3>;
  /** Follow speed. 0 = snap every frame, higher = tighter (try 8-15). */
  smoothing?: number;
};

/** The "normal" camera: orbits a point, optionally follows a mesh, node or model. */
export class OrbitCamera extends BaseCamera {
  followTarget: Followable | null = null;
  followOffset: Vec3 = { x: 0, y: 0, z: 0 };
  followSmoothing = 0;

  private detach: (() => void) | null = null;
  private controlsOn = false;

  constructor(
    scene: SceneContext,
    canvas: HTMLCanvasElement,
    options: OrbitOptions = {},
  ) {
    super(
      scene,
      canvas,
      createArcRotateCamera(
        options.alpha ?? -Math.PI / 2,
        options.beta ?? Math.PI / 2.1,
        options.radius ?? 2,
        {
          x: options.target?.x ?? 0,
          y: options.target?.y ?? 0,
          z: options.target?.z ?? 0,
        },
      ),
    );
  }

  attachControl(value: boolean) {
    this.controlsOn = value;
    this.detach?.();
    this.detach = null;
    // Only touch the scene's input while this camera is the active one.
    if (value && this.scene.camera === this.main) {
      this.detach = attachControl(this.main, this.canvas, this.scene);
    }
  }

  follow(target: FollowTarget, options: FollowOptions = {}) {
    const node = resolveTarget(target);
    this.followTarget = node;
    this.followSmoothing = options.smoothing ?? 0;
    this.followOffset = {
      x: options.offset?.x ?? 0,
      y: options.offset?.y ?? 0,
      z: options.offset?.z ?? 0,
    };
    if (options.radius !== undefined) this.main.radius = options.radius;

    // Snap once so the camera doesn't sweep in from the old target.
    const p = node.position;
    const o = this.followOffset;
    this.main.target.x = p.x + o.x;
    this.main.target.y = p.y + o.y;
    this.main.target.z = p.z + o.z;
  }

  stopFollow() {
    this.followTarget = null;
  }

  setFollowOffset(x: number, y: number, z: number) {
    this.followOffset = { x, y, z };
  }

  update(delta: number) {
    if (!this.followTarget) return;
    const p = this.followTarget.position;
    const o = this.followOffset;
    const t = smoothFactor(this.followSmoothing, delta);
    const tg = this.main.target;

    tg.x += (p.x + o.x - tg.x) * t;
    tg.y += (p.y + o.y - tg.y) * t;
    tg.z += (p.z + o.z - tg.z) * t;
  }

  protected onActivate() {
    if (this.controlsOn) this.attachControl(true);
  }

  protected onDeactivate() {
    this.detach?.();
    this.detach = null;
  }
}
