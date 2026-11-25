// camera/TpsCamera.ts
import {
  createArcRotateCamera,
  type Mesh,
  type SceneContext,
} from "@babylonjs/lite";
import { BaseCamera, smoothFactor } from "./BaseCamera";
import {
  applyYawPitch,
  MouseLook,
  type LookLimits,
  type Vec3,
} from "./MouseLook";

export type TpsOptions = {
  target: Mesh;
  radius?: number;
  /** Look-at point relative to the target (e.g. head height). Default: y 1.5. */
  offset?: Partial<Vec3>;
  /** Sideways shift along the camera's right vector. Positive = over the right shoulder. */
  shoulder?: number;
  /** Follow speed. 0 = snap, higher = tighter. Default 12. */
  smoothing?: number;
  sensitivity?: number;
  invertY?: boolean;
  /**
   * Max degrees to look up/down from horizontal.
   * Default 35 up / 70 down. "Up" swings the camera lower toward the ground.
   */
  lookLimits?: LookLimits;
  /** Rotate the target mesh's Y rotation to match the camera yaw. Default: false. */
  syncTargetYaw?: boolean;
};

/** Third-person camera: orbits behind a target with pointer-lock mouse look. */
export class TpsCamera extends BaseCamera {
  look: MouseLook;
  target: Mesh;
  radius: number;
  offset: Vec3;
  shoulder: number;
  smoothing: number;
  syncTargetYaw: boolean;

  constructor(
    scene: SceneContext,
    canvas: HTMLCanvasElement,
    options: TpsOptions,
  ) {
    super(
      scene,
      canvas,
      createArcRotateCamera(-Math.PI / 2, Math.PI / 2.1, options.radius ?? 5, {
        x: 0,
        y: 0,
        z: 0,
      }),
    );

    this.target = options.target;
    this.radius = options.radius ?? 5;
    this.shoulder = options.shoulder ?? 0;
    this.smoothing = options.smoothing ?? 12;
    this.syncTargetYaw = options.syncTargetYaw ?? false;
    this.offset = {
      x: options.offset?.x ?? 0,
      y: options.offset?.y ?? 1.5,
      z: options.offset?.z ?? 0,
    };

    this.look = new MouseLook(canvas);
    this.look.setLookLimits({ up: 35, down: 70, ...options.lookLimits });
    if (options.sensitivity !== undefined)
      this.look.sensitivity = options.sensitivity;
    if (options.invertY !== undefined) this.look.invertY = options.invertY;

    // Snap to the target immediately.
    this.snap();
  }

  /** Limit vertical look in degrees from horizontal. */
  setLookLimits(limits: LookLimits) {
    this.look.setLookLimits(limits);
    return this;
  }

  /** Flat forward / right vectors for movement code. */
  get forward() {
    return this.look.forward;
  }
  get right() {
    return this.look.right;
  }

  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  private desiredTarget(): Vec3 {
    const p = this.target.position;
    const r = this.look.right;
    return {
      x: p.x + this.offset.x + r.x * this.shoulder,
      y: p.y + this.offset.y,
      z: p.z + this.offset.z + r.z * this.shoulder,
    };
  }

  private snap() {
    const d = this.desiredTarget();
    this.main.target.x = d.x;
    this.main.target.y = d.y;
    this.main.target.z = d.z;
    applyYawPitch(this.main, this.look.yaw, this.look.pitch, this.radius);
  }

  update(delta: number) {
    const d = this.desiredTarget();
    const t = smoothFactor(this.smoothing, delta);
    const tg = this.main.target;

    tg.x += (d.x - tg.x) * t;
    tg.y += (d.y - tg.y) * t;
    tg.z += (d.z - tg.z) * t;

    applyYawPitch(this.main, this.look.yaw, this.look.pitch, this.radius);

    if (this.syncTargetYaw) this.target.rotation.y = this.look.yaw;
  }

  protected onActivate() {
    this.look.enable();
    this.snap();
  }

  protected onDeactivate() {
    this.look.disable();
  }
}
