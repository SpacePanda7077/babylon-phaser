import {
  addToScene,
  type EngineContext,
  type SceneContext,
  loadBabylon,
  loadGltf,
} from "@babylonjs/lite";
import { Cube, type CubeOptions } from "./game-objects/Cube";
import { Sphere, type SphereOptions } from "./game-objects/Sphere";
import { Plane, type PlaneOptions } from "./game-objects/Plane";
import { Cylinder, type CylinderOptions } from "./game-objects/Cylinder";
import { Cone, type ConeOptions } from "./game-objects/Cone";
import { Capsule, type CapsuleOptions } from "./game-objects/Capsule";
import type { Shape, Vec3 } from "./game-objects/Shape";
import { Model, type ModelOptions } from "./game-objects/Model";

type AssetSource = string | ArrayBuffer | Blob;

/** Extra per-shape size options. Everything is optional and has a default. */
type Dimensions<T> = Omit<T, "color" | "alpha" | "position">;

export class Add {
  private babylon_scene: SceneContext;
  private engine: EngineContext;

  constructor(babylon_scene: SceneContext, engine: EngineContext) {
    this.babylon_scene = babylon_scene;
    this.engine = engine;
  }

  /** Adds the shape's mesh to the scene and returns the shape. */
  private register<T extends Shape>(shape: T): T {
    addToScene(this.babylon_scene, shape.mesh);
    return shape;
  }

  /**
   * Adds a cube to the scene.
   *
   * @param position - World-space position {x, y, z}.
   * @param dimensions - Width, height and depth. Each defaults to 1.
   * @param color - Hex color. Defaults to white "0xffffff".
   * @param alpha - Transparency from 0 to 1. Defaults to 1.
   * @returns The created cube.
   *
   * @example
   * ```ts
   * const cube = this.add.Cube({ x: 0, y: 5, z: 0 }, { width: 2, height: 3, depth: 5 });
   * ```
   */
  Cube(
    position: Vec3,
    dimensions: Dimensions<CubeOptions> = {},
    color?: string,
    alpha?: number,
  ) {
    return this.register(
      new Cube(this.engine, { ...dimensions, color, position, alpha }),
    );
  }

  /**
   * Adds a sphere to the scene.
   *
   * @param position - World-space position {x, y, z}.
   * @param dimensions - Diameter (default 1) and segments (default 16).
   * @param color - Hex color. Defaults to white.
   * @param alpha - Transparency from 0 to 1. Defaults to 1.
   * @returns The created sphere.
   */
  Sphere(
    position: Vec3,
    dimensions: Dimensions<SphereOptions> = {},
    color?: string,
    alpha?: number,
  ) {
    return this.register(
      new Sphere(this.engine, { ...dimensions, color, position, alpha }),
    );
  }

  /**
   * Adds a plane to the scene.
   *
   * @param position - World-space position {x, y, z}.
   * @param dimensions - Width and height. Each defaults to 1.
   * @param color - Hex color. Defaults to white.
   * @param alpha - Transparency from 0 to 1. Defaults to 1.
   * @returns The created plane.
   */
  Plane(
    position: Vec3,
    dimensions: Dimensions<PlaneOptions> = {},
    color?: string,
    alpha?: number,
  ) {
    return this.register(
      new Plane(this.engine, { ...dimensions, color, position, alpha }),
    );
  }

  /**
   * Adds a cylinder to the scene.
   *
   * @param position - World-space position {x, y, z}.
   * @param dimensions - Height, diameter, diameterTop, diameterBottom, tessellation.
   * @param color - Hex color. Defaults to white.
   * @param alpha - Transparency from 0 to 1. Defaults to 1.
   * @returns The created cylinder.
   */
  Cylinder(
    position: Vec3,
    dimensions: Dimensions<CylinderOptions> = {},
    color?: string,
    alpha?: number,
  ) {
    return this.register(
      new Cylinder(this.engine, { ...dimensions, color, position, alpha }),
    );
  }

  /**
   * Adds a cone to the scene (a cylinder with a top diameter of 0).
   *
   * @param position - World-space position {x, y, z}.
   * @param dimensions - Height, base diameter, tessellation.
   * @param color - Hex color. Defaults to white.
   * @param alpha - Transparency from 0 to 1. Defaults to 1.
   * @returns The created cone.
   */
  Cone(
    position: Vec3,
    dimensions: Dimensions<ConeOptions> = {},
    color?: string,
    alpha?: number,
  ) {
    return this.register(
      new Cone(this.engine, { ...dimensions, color, position, alpha }),
    );
  }

  /**
   * Adds a capsule to the scene.
   *
   * @param position - World-space position {x, y, z}.
   * @param dimensions - Radius, total height, tessellation.
   * @param color - Hex color. Defaults to white.
   * @param alpha - Transparency from 0 to 1. Defaults to 1.
   * @returns The created capsule.
   */
  Capsule(
    position: Vec3,
    dimensions: Dimensions<CapsuleOptions> = {},
    color?: string,
    alpha?: number,
  ) {
    return this.register(
      new Capsule(this.engine, { ...dimensions, color, position, alpha }),
    );
  }

  /** .glb or .gltf. URL, ArrayBuffer or Blob. */
  async glb(source: AssetSource, options: ModelOptions = {}) {
    const container = await loadGltf(this.engine, source);
    addToScene(this.babylon_scene, container);
    return new Model(container, options);
  }

  /** Same loader as glb(). Kept so both names work. */
  gltf(source: AssetSource, options: ModelOptions = {}) {
    return this.glb(source, options);
  }

  /** Babylon.js .babylon scene file (URL only). */
  async babylon(url: string, options: ModelOptions = {}) {
    const container = await loadBabylon(this.engine, url);
    addToScene(this.babylon_scene, container);
    return new Model(container, options);
  }

  /** Picks the loader from the file extension. */
  asset(source: AssetSource, options: ModelOptions = {}) {
    if (typeof source !== "string") return this.glb(source, options); // raw data: glb/gltf
    const ext = source.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
    if (ext === "glb" || ext === "gltf") return this.glb(source, options);
    if (ext === "babylon") return this.babylon(source, options);
    throw new Error(`add.asset: unsupported format ".${ext}"`);
  }
}
