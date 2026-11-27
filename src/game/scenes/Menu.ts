import { Scene } from "../babylon-phaser/scene/Scene";
import type { WasdKeys } from "../babylon-phaser/input/Keyboard/Keyboard";
import type { Model } from "../babylon-phaser/add/game-objects/Model";

export class Menu extends Scene {
  player: Model;
  inputs: WasdKeys;
  speed = 1;
  input_vector = { x: 0, y: 0 };
  cam: import("../babylon-phaser/Camera/TpsCamera").TpsCamera;

  constructor() {
    super();
  }
  async create() {
    this.add
      .Plane({ x: 0, y: 0, z: 0 }, { width: 10, height: 10 }, "0xfff000")
      .setRotation(Math.PI / 2, 0, 0)
      .setReceiveShadow(true);

    this.player = await (await this.add.glb("model.glb"))
      .setCastShadow(true)
      .setReceiveShadow(true);
    this.inputs = this.input.keyBoard.addWASD();

    this.cam = this.camera.addTps("tps", {
      target: this.player.node,
      offset: { y: 1 },
      shoulder: 0.6,
      lookLimits: { up: 20, down: 40 },
      syncTargetYaw: true,
    });
    this.camera.switchTo("tps");
  }
  update(delta: number): void {
    this.updateInputs();
    const { x: dx, z: dy } = this.cam.moveDirection(
      this.input_vector.x,
      this.input_vector.y,
    );
    this.player.x += dx * this.speed * (delta / 1000);
    this.player.z += dy * this.speed * (delta / 1000);
  }

  updateInputs() {
    if (this.inputs.a.isDown()) {
      this.input_vector.x = -1;
    } else if (this.inputs.d.isDown()) {
      this.input_vector.x = 1;
    } else {
      this.input_vector.x = 0;
    }
    if (this.inputs.s.isDown()) {
      this.input_vector.y = -1;
    } else if (this.inputs.w.isDown()) {
      this.input_vector.y = 1;
    } else {
      this.input_vector.y = 0;
    }
  }
}
