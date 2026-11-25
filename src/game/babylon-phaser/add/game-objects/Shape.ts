// shapes/Shape.ts
import {
  createPbrMaterial,
  type Mesh,
  type PbrMaterialProps,
} from "@babylonjs/lite";
import { hex2rgb } from "../../utils/convert-hex-rgb";

export type Vec3 = { x: number; y: number; z: number };

/** Material options for a shape. Use `color` (hex) instead of `baseColorFactor`. */
export type ShapeMaterialOptions = Omit<PbrMaterialProps, "baseColorFactor"> & {
  color?: string;
};

export type ShapeOptions = ShapeMaterialOptions & {
  position?: Partial<Vec3>;
};

/** Base class for every primitive. Subclasses only create the mesh. */
export abstract class Shape<M extends Mesh = Mesh> {
  mesh: M;
  material: PbrMaterialProps;
  color: string;
  alpha: number;

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

  constructor(mesh: M, options: ShapeOptions = {}) {
    const { color, alpha, position, ...rest } = options;

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

  setScale(scale: number | { x?: number; y?: number; z?: number }) {
    if (typeof scale === "number") {
      this.mesh.scaling.set(scale, scale, scale);
    } else {
      this.mesh.scaling.set(scale.x ?? 1, scale.y ?? 1, scale.z ?? 1);
    }
    return this;
  }
}
