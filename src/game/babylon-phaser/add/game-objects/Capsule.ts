// shapes/Capsule.ts
import { createCapsule, type EngineContext } from "@babylonjs/lite"; // may not exist in Lite
import { Shape, type ShapeOptions } from "./Shape";

export type CapsuleOptions = ShapeOptions & {
  radius?: number;
  /** Total height, including the rounded ends. */
  height?: number;
  tessellation?: number;
};

export class Capsule extends Shape {
  constructor(engine: EngineContext, options: CapsuleOptions = {}) {
    const { radius, height, tessellation, ...shape } = options;
    super(
      createCapsule(engine, {
        radius: radius ?? 0.25,
        height: height ?? 1,
        tessellation: tessellation ?? 16,
      }),
      shape,
    );
  }
}
