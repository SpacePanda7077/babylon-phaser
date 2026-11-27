// camera/FpsCamera.ts
import {
  createArcRotateCamera,
  type SceneContext,
  type Vec3,
} from "@babylonjs/lite";
import { BaseCamera } from "./BaseCamera";
import {
  applyYawPitch,
  MouseLook,
  resolveTarget,
  type Followable,
  type FollowTarget,
  type LookLimits,
} from "./MouseLook";

export type FpsOptions = {
  /** What the eyes are attached to: a Shape, a Model, or a node/mesh. */
  target?: FollowTarget;
  /** Eye position relative to the target's position. Default: 1.6 up. */
  eyeOffset?: Partial<Vec3>;
  /** Start position when there is no target. */
  position?: Partial<Vec3>;
  sensitivity?: number;
  invertY?: boolean;
  /** Max degrees to look up/down from horizontal. Default 89 / 89. */
  lookLimits?: LookLimits;
  /** Rotate the target's Y rotation to match the view. Default: true. */
  syncTargetYaw?: boolean;
};

/** Tiny orbit radius: the camera sits (almost) exactly at the eye point. */
const EYE_RADIUS = 0.01;

/**
 * First-person camera. Built on the ArcRotate camera with a tiny radius, so
 * the "orbit" point is just in front of the eyes and mouse look turns the head.
 */
export class FpsCamera extends BaseCamera {
  look: MouseLook;
  target: Followable | null;
  eyeOffset: Vec3;
  position: Vec3;
  syncTargetYaw: boolean;

  constructor(
    scene: SceneContext,
    canvas: HTMLCanvasElement,
    options: FpsOptions = {},
  ) {
    super(
      scene,
      canvas,
      createArcRotateCamera(-Math.PI / 2, Math.PI / 2, EYE_RADIUS, {
        x: 0,
        y: 0,
        z: 0,
      }),
    );

    this.target = options.target ? resolveTarget(options.target) : null;
    this.syncTargetYaw = options.syncTargetYaw ?? true;
    this.eyeOffset = {
      x: options.eyeOffset?.x ?? 0,
      y: options.eyeOffset?.y ?? 1.6,
      z: options.eyeOffset?.z ?? 0,
    };
    this.position = {
      x: options.position?.x ?? 0,
      y: options.position?.y ?? 0,
      z: options.position?.z ?? 0,
    };

    this.look = new MouseLook(canvas);
    if (options.lookLimits) this.look.setLookLimits(options.lookLimits);
    if (options.sensitivity !== undefined)
      this.look.sensitivity = options.sensitivity;
    if (options.invertY !== undefined) this.look.invertY = options.invertY;
  }

  attachTo(target: FollowTarget | null) {
    this.target = target ? resolveTarget(target) : null;
    return this;
  }

  setPosition(x: number, y: number, z: number) {
    this.position = { x, y, z };
    return this;
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

  update(_delta: number) {
    const base = this.target ? this.target.position : this.position;
    const eye = {
      x: base.x + this.eyeOffset.x,
      y: base.y + this.eyeOffset.y,
      z: base.z + this.eyeOffset.z,
    };

    // The look-at point sits just in front of the eye, so the camera is at the eye.
    const d = this.look.direction;
    this.main.target.x = eye.x + d.x * EYE_RADIUS;
    this.main.target.y = eye.y + d.y * EYE_RADIUS;
    this.main.target.z = eye.z + d.z * EYE_RADIUS;
    applyYawPitch(this.main, this.look.yaw, this.look.pitch, EYE_RADIUS);

    if (this.target && this.syncTargetYaw) {
      this.target.rotation.y = this.look.yaw;
    }
  }

  protected onActivate() {
    this.look.enable();
  }

  protected onDeactivate() {
    this.look.disable();
  }
}
