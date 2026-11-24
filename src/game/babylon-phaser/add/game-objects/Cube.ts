// shapes/Cube.ts
import { createBox, type EngineContext } from "@babylonjs/lite";
import { Shape, type ShapeOptions } from "./Shape";

export type CubeOptions = ShapeOptions & {
  width?: number;
  height?: number;
  depth?: number;
};

export class Cube extends Shape {
  constructor(engine: EngineContext, options: CubeOptions = {}) {
    const { width, height, depth, ...shape } = options;
    super(
      createBox(engine, {
        width: width ?? 1,
        height: height ?? 1,
        depth: depth ?? 1,
      }),
      shape,
    );
  }
}
