import { Scene } from "../babylon-phaser/scene/Scene";
import type { WasdKeys } from "../babylon-phaser/input/Keyboard/Keyboard";
import { Player } from "./Player/Player";
import { InputHandler } from "./Inputs/input";

export class Menu extends Scene {
  static key = "Menu";
  d: WasdKeys;

  player: Player;
  input_handler: InputHandler;
  switchscene: import("../babylon-phaser/input/Keyboard/Key").Key;
  cam: import("../babylon-phaser/Camera/TpsCamera").TpsCamera;

  constructor() {
    super();
  }
  async create() {
    this.add
      .Plane({ x: 0, y: 0, z: 0 }, { width: 10, height: 10 })
      .setRotation(Math.PI / 2, 0, 0);

    this.player = new Player(this);

    this.add.glb("https://playground.babylonjs.com/scenes/BoomBox.glb");
    this.cam = this.camera.addTps("tps", {
      target: this.player.body.mesh,
      radius: 3,
      shoulder: 0.6, // over the right shoulder
      offset: { y: 0.5 },
      sensitivity: 0.0005,
      syncTargetYaw: true,
      lookLimits: { up: 15, down: 60 },
    });
    this.camera.addFps("fps", { target: this.player.body.mesh });
    this.camera.switchTo("tps");
    this.input_handler = new InputHandler(this);
    this.switchscene = this.input.keyBoard.addKey("v");
    this.player.body.setVisible(false);
  }
  update(delta: number): void {
    this.input_handler.update();
    const dir = this.camera.moveDirection(
      this.input_handler.input_vector.x,
      this.input_handler.input_vector.y,
    );

    this.player.update(dir, delta);

    if (this.switchscene.justDown()) {
      this.scene.restart();
      console.log("Switch");
    }
  }
}
