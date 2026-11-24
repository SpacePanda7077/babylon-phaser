import {
  addToScene,
  createDirectionalLight,
  createHemisphericLight,
  createLightGizmo,
  createPointLight,
  type DirectionalLight,
  type EngineContext,
  type HemisphericLight,
  type PointLight,
  type SceneContext,
} from "@babylonjs/lite";

export class Light {
  lights: (HemisphericLight | DirectionalLight | PointLight)[] = [];
  babylon_scene: SceneContext;
  private engine: EngineContext;

  constructor(babylon_scene: SceneContext, engine: EngineContext) {
    this.babylon_scene = babylon_scene;
    this.engine = engine;
    const light = createHemisphericLight([3, 5, 0], 10);
    addToScene(babylon_scene, light); // the scene now owns it
    this.lights.push(light);
  }

  addPointLight(
    position: { x: number; y: number; z: number },
    intensity?: number,
    options?: {
      name?: string;
    },
  ) {
    const light = createPointLight(
      [position.x, position.y, position.z],
      intensity || 0.5,
    );
    light.name = options?.name || "";
    addToScene(this.babylon_scene, light);
    this.lights.push(light);
    return light;
  }

  addHemisphericLight(
    position: { x: number; y: number; z: number },
    intensity?: number,
    options?: {
      name?: string;
    },
  ) {
    const light = createHemisphericLight(
      [position.x, position.y, position.z],
      intensity || 0.5,
    );
    light.name = options?.name || "";
    addToScene(this.babylon_scene, light);
    this.lights.push(light);
    return light;
  }

  addDirectionalLight(
    position: { x: number; y: number; z: number },
    intensity?: number,
    options?: {
      name?: string;
    },
  ) {
    const light = createDirectionalLight(
      [position.x, position.y, position.z],
      intensity || 0.5,
    );
    light.name = options?.name || "";
    addToScene(this.babylon_scene, light);
    this.lights.push(light);
    return light;
  }
}
