// babylon-phaser/babylon-scene/Babylon-Scene.ts
import {
  createSceneContext,
  type EngineContext,
  type SceneContext,
} from "@babylonjs/lite";

export class BabylonScene {
  babylon_scene: SceneContext;

  constructor(engine: EngineContext) {
    this.babylon_scene = createSceneContext(engine);
  }
}
