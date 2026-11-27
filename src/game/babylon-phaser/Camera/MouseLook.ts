// camera/MouseLook.ts
import type { ArcRotateCamera, Vec3 } from "@babylonjs/lite";

/** Anything a camera can follow: a Mesh, a SceneNode, or any {position, rotation}. */
export type Followable = { position: Vec3; rotation: Vec3 };

/** What you can pass as a target: a node/mesh, or a Model/Shape wrapper. */
export type FollowTarget =
  | Followable
  | { node: Followable }
  | { mesh: Followable };

export function resolveTarget(t: FollowTarget): Followable {
  if ("position" in t) return t;
  if ("node" in t) return t.node;
  return t.mesh;
}

/** Max degrees to look up / down from horizontal. */
export type LookLimits = { up?: number; down?: number };

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const MAX_LIMIT_DEG = 89; // 90 would flip the camera

/**
 * Convert a look direction (yaw/pitch) into ArcRotate alpha/beta.
 * The camera sits at `target - direction * radius`, looking at `target`.
 * yaw 0 looks toward +Z, positive yaw turns right, positive pitch looks up.
 */
export function applyYawPitch(
  cam: ArcRotateCamera,
  yaw: number,
  pitch: number,
  radius: number,
) {
  cam.alpha = Math.atan2(-Math.cos(yaw), -Math.sin(yaw));
  cam.beta = Math.PI / 2 + pitch;
  cam.radius = radius;
}

/** Pointer-lock mouse look. Click the canvas to capture the mouse, Esc to release. */
export class MouseLook {
  yaw = 0;
  pitch = 0;
  sensitivity = 0.002;
  minPitch = -MAX_LIMIT_DEG * DEG2RAD; // looking down
  maxPitch = MAX_LIMIT_DEG * DEG2RAD; // looking up
  invertY = false;

  private canvas: HTMLCanvasElement;
  private enabled = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  get locked() {
    return document.pointerLockElement === this.canvas;
  }

  // ---- vertical look angle (degrees) -----------------------------------

  /**
   * Limit vertical look. `up` and `down` are degrees from horizontal.
   * Omitted values keep their current limit.
   * @example look.setLookLimits({ up: 30, down: 60 });
   */
  setLookLimits(limits: LookLimits) {
    const clamp = (d: number) =>
      Math.min(Math.max(d, 0), MAX_LIMIT_DEG) * DEG2RAD;
    if (limits.up !== undefined) this.maxPitch = clamp(limits.up);
    if (limits.down !== undefined) this.minPitch = -clamp(limits.down);
    this.pitch = this.clampPitch(this.pitch);
    return this;
  }

  get lookLimits(): Required<LookLimits> {
    return { up: this.maxPitch * RAD2DEG, down: -this.minPitch * RAD2DEG };
  }

  /** Current vertical angle in degrees. Positive = looking up. */
  get pitchDeg() {
    return this.pitch * RAD2DEG;
  }
  set pitchDeg(v: number) {
    this.pitch = this.clampPitch(v * DEG2RAD);
  }

  /** Current horizontal angle in degrees. */
  get yawDeg() {
    return this.yaw * RAD2DEG;
  }
  set yawDeg(v: number) {
    this.yaw = v * DEG2RAD;
  }

  private clampPitch(p: number) {
    return Math.min(this.maxPitch, Math.max(this.minPitch, p));
  }

  // ---- vectors ---------------------------------------------------------

  /** Flat forward vector (ignores pitch). Use for WASD movement. */
  get forward(): Vec3 {
    return { x: Math.sin(this.yaw), y: 0, z: Math.cos(this.yaw) };
  }

  /** Flat right vector. Use for strafing. */
  get right(): Vec3 {
    return { x: Math.cos(this.yaw), y: 0, z: -Math.sin(this.yaw) };
  }

  /** Full 3D look direction (includes pitch). */
  get direction(): Vec3 {
    const cp = Math.cos(this.pitch);
    return {
      x: Math.sin(this.yaw) * cp,
      y: Math.sin(this.pitch),
      z: Math.cos(this.yaw) * cp,
    };
  }

  // ---- input -----------------------------------------------------------

  enable() {
    if (this.enabled) return;
    this.enabled = true;
    this.canvas.addEventListener("click", this.onClick);
    document.addEventListener("mousemove", this.onMove);
  }

  disable() {
    if (!this.enabled) return;
    this.enabled = false;
    this.canvas.removeEventListener("click", this.onClick);
    document.removeEventListener("mousemove", this.onMove);
    if (this.locked) document.exitPointerLock();
  }

  private onClick = () => {
    if (!this.locked) this.canvas.requestPointerLock();
  };

  private onMove = (e: MouseEvent) => {
    if (!this.locked) return;
    const dir = this.invertY ? -1 : 1;
    this.yaw += e.movementX * this.sensitivity;
    this.pitch = this.clampPitch(
      this.pitch - e.movementY * this.sensitivity * dir,
    );
  };
}
