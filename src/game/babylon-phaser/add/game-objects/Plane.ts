// shapes/Plane.ts
import { createPlane, type EngineContext } from "@babylonjs/lite"; // name unverified
import { Shape, type ShapeOptions } from "./Shape";

export type PlaneOptions = ShapeOptions & {
  width?: number;
  height?: number;
};

export class Plane extends Shape {
  constructor(engine: EngineContext, options: PlaneOptions = {}) {
    const { width, height, ...shape } = options;
    super(
      createPlane(engine, { width: width ?? 1, height: height ?? 1 }),
      shape,
    );
  }
}
