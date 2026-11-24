// shapes/Cylinder.ts
import { createCylinder, type EngineContext } from "@babylonjs/lite"; // name and args unverified
import { Shape, type ShapeOptions } from "./Shape";

export type CylinderOptions = ShapeOptions & {
  height?: number;
  /** Sets both ends. Overridden by diameterTop / diameterBottom. */
  diameter?: number;
  diameterTop?: number;
  diameterBottom?: number;
  /** Number of sides. Low values (3 to 6) give prisms. */
  tessellation?: number;
};

export class Cylinder extends Shape {
  constructor(engine: EngineContext, options: CylinderOptions = {}) {
    const {
      height,
      diameter,
      diameterTop,
      diameterBottom,
      tessellation,
      ...shape
    } = options;
    super(
      createCylinder(engine, {
        height: height ?? 2,
        diameterTop: diameterTop ?? diameter ?? 1,
        diameterBottom: diameterBottom ?? diameter ?? 1,
        tessellation: tessellation ?? 24,
      }),
      shape,
    );
  }
}
