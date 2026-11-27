// add/game-objects/Model.ts
import {
  setMeshVisible,
  type AssetContainer,
  type Mesh,
  type SceneNode,
} from "@babylonjs/lite";
import { shadows } from "./Shadows";

export type Vec3 = { x: number; y: number; z: number };

export type ModelOptions = {
  position?: Partial<Vec3>;
  /** Euler rotation in radians. */
  rotation?: Partial<Vec3>;
  scale?: number | Partial<Vec3>;
  visible?: boolean;
  /** Every mesh in the asset casts a shadow. */
  castShadow?: boolean;
  /** Every mesh in the asset receives shadows. */
  receiveShadow?: boolean;
};

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/** A loaded 3D asset (glb, gltf, .babylon). Same API as Shape: x/y/z, rotation, scale, visible. */
export class Model {
  container: AssetContainer;
  /** Root node of the asset. Pass this to cameras as a follow target. */
  node: SceneNode;

  // The loader gives the glTF root its own scaling (it mirrors X to convert
  // handedness). Overwriting it would flip the model, so user scale is
  // stored separately and multiplied on top of this.
  private base: Vec3;
  private user: Vec3 = { x: 1, y: 1, z: 1 };
  private _castShadow = false;
  private _receiveShadow = false;

  constructor(container: AssetContainer, options: ModelOptions = {}) {
    const root = container.entities[0];
    if (!root) throw new Error("Model: asset has no entities");

    this.container = container;
    this.node = root as SceneNode;
    this.base = {
      x: this.node.scaling.x,
      y: this.node.scaling.y,
      z: this.node.scaling.z,
    };

    this.setPosition(
      options.position?.x ?? 0,
      options.position?.y ?? 0,
      options.position?.z ?? 0,
    );
    this.setRotation(
      options.rotation?.x ?? 0,
      options.rotation?.y ?? 0,
      options.rotation?.z ?? 0,
    );
    if (options.scale !== undefined) this.setScale(options.scale);
    if (options.visible !== undefined) this.setVisible(options.visible);
    if (options.castShadow !== undefined) this.castShadow = options.castShadow;
    if (options.receiveShadow !== undefined)
      this.receiveShadow = options.receiveShadow;
  }

  /** All renderable meshes in the asset (glTF nodes without geometry are skipped). */
  private get meshes(): Mesh[] {
    return (this.container.entities as unknown[]).filter(
      (e): e is Mesh => !!e && typeof e === "object" && "receiveShadows" in e,
    );
  }

  /** Animation groups from the file. addToScene already ticks them. */
  get animations() {
    return this.container.animationGroups ?? [];
  }

  // ---- position ---------------------------------------------------------
  get x() {
    return this.node.position.x;
  }
  set x(v: number) {
    this.node.position.x = v;
  }
  get y() {
    return this.node.position.y;
  }
  set y(v: number) {
    this.node.position.y = v;
  }
  get z() {
    return this.node.position.z;
  }
  set z(v: number) {
    this.node.position.z = v;
  }

  // ---- rotation (radians) -----------------------------------------------
  get rotationX() {
    return this.node.rotation.x;
  }
  set rotationX(v: number) {
    this.node.rotation.x = v;
  }
  get rotationY() {
    return this.node.rotation.y;
  }
  set rotationY(v: number) {
    this.node.rotation.y = v;
  }
  get rotationZ() {
    return this.node.rotation.z;
  }
  set rotationZ(v: number) {
    this.node.rotation.z = v;
  }

  // ---- rotation (degrees) -----------------------------------------------
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

  // ---- scale (1 = original size) ----------------------------------------
  get scaleX() {
    return this.user.x;
  }
  set scaleX(v: number) {
    this.user.x = v;
    this.node.scaling.x = this.base.x * v;
  }
  get scaleY() {
    return this.user.y;
  }
  set scaleY(v: number) {
    this.user.y = v;
    this.node.scaling.y = this.base.y * v;
  }
  get scaleZ() {
    return this.user.z;
  }
  set scaleZ(v: number) {
    this.user.z = v;
    this.node.scaling.z = this.base.z * v;
  }

  // ---- visibility -------------------------------------------------------
  get visible(): boolean {
    return this.node.visible ?? true;
  }
  set visible(v: boolean) {
    setMeshVisible(this.node, v); // cascades to children
  }

  // ---- shadows ----------------------------------------------------------
  get castShadow(): boolean {
    return this._castShadow;
  }
  set castShadow(v: boolean) {
    if (v === this._castShadow) return;
    this._castShadow = v;
    if (v) shadows.add(this.meshes);
    else shadows.remove(this.meshes);
  }

  get receiveShadow(): boolean {
    return this._receiveShadow;
  }
  set receiveShadow(v: boolean) {
    this._receiveShadow = v;
    for (const m of this.meshes) m.receiveShadows = v;
  }

  // ---- chainable setters ------------------------------------------------
  setPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  getPosition(): Vec3 {
    return { x: this.x, y: this.y, z: this.z };
  }

  setRotation(x: number, y: number, z: number) {
    this.rotationX = x;
    this.rotationY = y;
    this.rotationZ = z;
    return this;
  }

  setAngle(x: number, y: number, z: number) {
    return this.setRotation(x * DEG2RAD, y * DEG2RAD, z * DEG2RAD);
  }

  rotate(x: number, y: number, z: number) {
    this.rotationX += x;
    this.rotationY += y;
    this.rotationZ += z;
    return this;
  }

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
