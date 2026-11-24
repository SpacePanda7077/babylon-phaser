// shapes/Sphere.ts
import { createSphere, type EngineContext } from "@babylonjs/lite";
import { Shape, type ShapeOptions } from "./Shape";

export type SphereOptions = ShapeOptions & {
  diameter?: number;
  segments?: number;
};

export class Sphere extends Shape {
  constructor(engine: EngineContext, options: SphereOptions = {}) {
    const { diameter, segments, ...shape } = options;
    super(
      createSphere(engine, {
        diameter: diameter ?? 1,
        segments: segments ?? 16,
      }),
      shape,
    );
  }
}
