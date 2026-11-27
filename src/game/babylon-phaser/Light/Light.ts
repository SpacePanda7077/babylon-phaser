import {
  addToScene,
  createDirectionalLight,
  createHemisphericLight,
  createPcfDirectionalShadowGenerator,
  createPointLight,
  type DirectionalLight,
  type EngineContext,
  type HemisphericLight,
  type PointLight,
  type SceneContext,
} from "@babylonjs/lite";
import { shadows } from "../add/game-objects/Shadows";

export class Light {
  lights: (HemisphericLight | DirectionalLight | PointLight)[] = [];
  babylon_scene: SceneContext;
  private engine: EngineContext;

  constructor(babylon_scene: SceneContext, engine: EngineContext) {
    this.babylon_scene = babylon_scene;
    this.engine = engine;
    // Light direction must point DOWN (negative y), otherwise it lights the
    // sky and nothing gets a shadow on the ground.
    // addDirectionalLight already adds it to the scene.
    const light = this.addDirectionalLight({ x: -3, y: -5, z: -1 }, 3);
    this.addHemisphericLight({ x: 0, y: 1, z: 0 }, 1);
    this.enableShadows(light);
  }

  /**
   * Make a directional light cast shadows. Everything with
   * `castShadow = true` (Shape / Model) is picked up automatically.
   */
  enableShadows(light: DirectionalLight, mapSize = 1024) {
    light.shadowGenerator = createPcfDirectionalShadowGenerator(
      this.engine,
      light,
      { mapSize },
    );
    shadows.bind(light.shadowGenerator);
    // The scene itself is registered in Scene.boot() with
    // registerSceneWithShadowSupport, replacing the plain registerScene.
  }

  addPointLight(
    position: { x: number; y: number; z: number },
    intensity?: number,
    options?: { name?: string },
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
    options?: { name?: string },
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
    options?: { name?: string; castShadow?: boolean },
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
