import { addToScene, createPbrMaterial, createSphere } from "@babylonjs/lite";
import { Scene } from "../babylon-phaser/scene/Scene";

export class Game extends Scene {
  static key = "Game";
  switchscene: import("../babylon-phaser/input/Keyboard/Key").Key;
  constructor() {
    super();
  }
  async create() {
    this.camera.attachControl(true);

    // const sphere = createSphere(this.engine, { segments: 16, diameter: 2 });
    // sphere.material = createPbrMaterial({
    //   baseColorFactor: [0.9, 0.1, 0.1, 1],
    //   metallicFactor: 0.1,
    //   roughnessFactor: 0.4,
    // });
    //addToScene(this.babylon_scene, sphere);

    const capsule = this.add
      .Cylinder({ x: 0, y: 0, z: 0 })
      .setColor("0x00ff00")
      .setScale({ x: 4, y: 0.5 });
    this.camera.attachControl(true);
    this.switchscene = this.input.keyBoard.addKey("v");
  }
  update(delta: number): void {
    if (this.switchscene.justDown()) {
      this.scene.start("Menu");
      console.log("Switch");
    }
  }
}
