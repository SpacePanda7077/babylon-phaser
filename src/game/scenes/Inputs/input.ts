import type { WasdKeys } from "../../babylon-phaser/input/Keyboard/Keyboard";
import type { Scene } from "../../babylon-phaser/scene/Scene";
export type input = { x: number; y: number };
export class InputHandler {
  scene: Scene;
  movekey: WasdKeys;
  input_vector: input;
  constructor(scene: Scene) {
    this.scene = scene;
    this.movekey = scene.input.keyBoard.addWASD();
    this.input_vector = { x: 0, y: 0 };
  }
  update() {
    this.input_vector = { x: 0, y: 0 };
    if (this.movekey.d.isDown()) {
      this.input_vector.x = 1;
    } else if (this.movekey.a.isDown()) {
      this.input_vector.x = -1;
    }

    if (this.movekey.w.isDown()) {
      this.input_vector.y = 1;
    } else if (this.movekey.s.isDown()) {
      this.input_vector.y = -1;
    }
  }
}
