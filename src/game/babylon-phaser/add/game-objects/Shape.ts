// shapes/Shape.ts
import {
  createPbrMaterial,
  setMeshVisible,
  type Mesh,
  type PbrMaterialProps,
} from "@babylonjs/lite";
import { hex2rgb } from "../../utils/convert-hex-rgb";
import { shadows } from "./Shadows";

export type Vec3 = { x: number; y: number; z: number };

/** Material options for a shape. Use `color` (hex) instead of `baseColorFactor`. */
export type ShapeMaterialOptions = Omit<PbrMaterialProps, "baseColorFactor"> & {
  color?: string;
};

export type ShapeOptions = ShapeMaterialOptions & {
  position?: Partial<Vec3>;
  /** Euler rotation in radians. */
  rotation?: Partial<Vec3>;
  scale?: number | Partial<Vec3>;
  visible?: boolean;
  /** Cast a shadow onto receivers. Needs a shadow generator bound via `shadows.bind`. */
  castShadow?: boolean;
  /** Receive shadows from casters. */
  receiveShadow?: boolean;
};

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/** Base class for every primitive. Subclasses only create the mesh. */
export abstract class Shape<M extends Mesh = Mesh> {
  mesh: M;
  material: PbrMaterialProps;
  color: string;
  alpha: number;
  private _castShadow = false;

  // Position accessors: `shape.x += 1` reads and writes the mesh directly.
  get x() {
    return this.mesh.position.x;
  }
  set x(v: number) {
    this.mesh.position.x = v;
  }

  get y() {
    return this.mesh.position.y;
  }
  set y(v: number) {
    this.mesh.position.y = v;
  }

  get z() {
    return this.mesh.position.z;
  }
  set z(v: number) {
    this.mesh.position.z = v;
  }

  // Scale accessors: `shape.scaleX *= 2`.
  get scaleX() {
    return this.mesh.scaling.x;
  }
  set scaleX(v: number) {
    this.mesh.scaling.x = v;
  }

  get scaleY() {
    return this.mesh.scaling.y;
  }
  set scaleY(v: number) {
    this.mesh.scaling.y = v;
  }

  get scaleZ() {
    return this.mesh.scaling.z;
  }
  set scaleZ(v: number) {
    this.mesh.scaling.z = v;
  }

  // Rotation accessors (radians): `shape.rotationY += delta * 0.002`.
  get rotationX() {
    return this.mesh.rotation.x;
  }
  set rotationX(v: number) {
    this.mesh.rotation.x = v;
  }

  get rotationY() {
    return this.mesh.rotation.y;
  }
  set rotationY(v: number) {
    this.mesh.rotation.y = v;
  }

  get rotationZ() {
    return this.mesh.rotation.z;
  }
  set rotationZ(v: number) {
    this.mesh.rotation.z = v;
  }

  // Same thing in degrees: `shape.angleY += 90`.
  get angleX() {
    return this.rotationX * RAD2DEG;
  }
  set angleX(v: number) {
    this.rotationX = v * DEG2RAD;
  }

  get angleY() {
    return this.rotationY * RAD2DEG;
  }
  set angleY(v: number) {
    this.rotationY = v * DEG2RAD;
  }

  get angleZ() {
    return this.rotationZ * RAD2DEG;
  }
  set angleZ(v: number) {
    this.rotationZ = v * DEG2RAD;
  }
  // Visibility: `if (shape.visible) ...` / `shape.visible = false`.
  get visible(): boolean {
    return this.mesh.visible ?? true;
  }
  set visible(v: boolean) {
    setMeshVisible(this.mesh, v);
  }
  // Shadows: `shape.castShadow = true` / `shape.receiveShadow = true`.
  get castShadow(): boolean {
    return this._castShadow;
  }
  set castShadow(v: boolean) {
    if (v === this._castShadow) return;
    this._castShadow = v;
    if (v) shadows.add([this.mesh]);
    else shadows.remove([this.mesh]);
  }

  get receiveShadow(): boolean {
    return this.mesh.receiveShadows ?? false;
  }
  set receiveShadow(v: boolean) {
    this.mesh.receiveShadows = v;
  }

  constructor(mesh: M, options: ShapeOptions = {}) {
    const {
      color,
      alpha,
      position,
      rotation,
      scale,
      visible,
      castShadow,
      receiveShadow,
      ...rest
    } = options;

    this.mesh = mesh;
    this.color = color ?? "0xffffff";
    this.alpha = alpha ?? 1;

    this.material = createPbrMaterial({
      ...rest,
      baseColorFactor: [...hex2rgb(this.color), 1],
      alpha: this.alpha,
      alphaBlend: this.alpha < 1,
    });
    this.mesh.material = this.material;

    this.setPosition(position?.x ?? 0, position?.y ?? 0, position?.z ?? 0);
    this.setRotation(rotation?.x ?? 0, rotation?.y ?? 0, rotation?.z ?? 0);
    if (scale !== undefined) this.setScale(scale);
    if (visible !== undefined) this.setVisible(visible);
    if (castShadow !== undefined) this.castShadow = castShadow;
    if (receiveShadow !== undefined) this.receiveShadow = receiveShadow;
  }

  /**
   * Update any material property at runtime.
   *
   * @param options - Material props to change. `color` is a hex string.
   *
   * @example
   * ```ts
   * shape.setMaterial({ color: "0xff0000", alpha: 0.5, metallicFactor: 0.8 });
   * ```
   */
  setMaterial(options: ShapeMaterialOptions) {
    const { color, alpha, ...rest } = options;
    Object.assign(this.material, rest);

    if (color !== undefined) this.color = color;

    if (alpha !== undefined) {
      this.alpha = alpha;
      this.material.alpha = alpha;
      if (alpha < 1) this.material.alphaBlend = true;
    }

    this.material.baseColorFactor = [...hex2rgb(this.color), 1];
    return this;
  }

  setColor(color: string) {
    return this.setMaterial({ color });
  }

  setAlpha(alpha: number) {
    return this.setMaterial({ alpha });
  }

  setPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  getPosition(): Vec3 {
    return { x: this.x, y: this.y, z: this.z };
  }

  /** Set Euler rotation in radians. */
  setRotation(x: number, y: number, z: number) {
    this.rotationX = x;
    this.rotationY = y;
    this.rotationZ = z;
    return this;
  }

  /** Set Euler rotation in degrees. */
  setAngle(x: number, y: number, z: number) {
    return this.setRotation(x * DEG2RAD, y * DEG2RAD, z * DEG2RAD);
  }

  /** Add to the current rotation (radians). */
  rotate(x: number, y: number, z: number) {
    this.rotationX += x;
    this.rotationY += y;
    this.rotationZ += z;
    return this;
  }

  /** Pass a number for uniform scale, or an object. Omitted axes keep their current value. */
  setScale(scale: number | Partial<Vec3>) {
    if (typeof scale === "number") {
      this.scaleX = scale;
      this.scaleY = scale;
      this.scaleZ = scale;
    } else {
      if (scale.x !== undefined) this.scaleX = scale.x;
      if (scale.y !== undefined) this.scaleY = scale.y;
      if (scale.z !== undefined) this.scaleZ = scale.z;
    }
    return this;
  }

  getScale(): Vec3 {
    return { x: this.scaleX, y: this.scaleY, z: this.scaleZ };
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    return this;
  }

  setCastShadow(cast: boolean) {
    this.castShadow = cast;
    return this;
  }

  setReceiveShadow(receive: boolean) {
    this.receiveShadow = receive;
    return this;
  }
}
