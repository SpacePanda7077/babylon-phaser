import { createSceneContext, type EngineContext } from "@babylonjs/lite";

export class BabylonScene {
  babylon_scene: import("@babylonjs/lite").SceneContext;
  constructor(engine: EngineContext) {
    this.babylon_scene = createSceneContext(engine);
  }
}
