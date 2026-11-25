import type { Capsule } from "../../babylon-phaser/add/game-objects/Capsule";
import type { Scene } from "../../babylon-phaser/scene/Scene";
import type { input } from "../Inputs/input";

export class Player {
  scene: Scene;
  body: Capsule;
  constructor(scene: Scene) {
    this.scene = scene;
    this.createBody();
  }
  createBody() {
    this.body = this.scene.add.Capsule({ x: 0, y: 0, z: 0 });
  }
  update(input: input, delta: number) {
    const dt = delta / 1000;
    this.handle_input(input, dt);
  }

  handle_input(input: input, dt: number) {
    this.body.x += input.x * 0.5 * dt;
    this.body.z += input.y * 0.5 * dt;
  }
}
