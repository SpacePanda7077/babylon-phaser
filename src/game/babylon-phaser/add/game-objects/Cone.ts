// shapes/Cone.ts
import type { EngineContext } from "@babylonjs/lite";
import { Cylinder, type CylinderOptions } from "./Cylinder";

export type ConeOptions = Omit<
  CylinderOptions,
  "diameter" | "diameterTop" | "diameterBottom"
> & {
  /** Diameter of the base. */
  diameter?: number;
};

/** A cylinder whose top diameter is 0. */
export class Cone extends Cylinder {
  constructor(engine: EngineContext, options: ConeOptions = {}) {
    const { diameter, ...rest } = options;
    super(engine, { ...rest, diameterTop: 0, diameterBottom: diameter ?? 1 });
  }
}
