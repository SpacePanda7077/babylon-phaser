import type { MoveDir } from "../../babylon-phaser/Camera/BaseCamera";
import type { Scene } from "../../babylon-phaser/scene/Scene";

export class Player {
  scene: Scene;
  body!: ReturnType<Scene["add"]["Cube"]>;
  speed = 3; // units per second
  turnToMovement = true;

  constructor(scene: Scene) {
    this.scene = scene;
    this.createBody();
  }

  createBody() {
    this.body = this.scene.add
      .Cube({ x: 0, y: 0.5, z: 0 }, {}, "0xff0000")
      .setScale(0.5);
  }

  update(dir: MoveDir, delta: number) {
    const dt = delta / 1000;

    this.body.x += dir.x * this.speed * dt;
    this.body.z += dir.z * this.speed * dt;

    if (this.turnToMovement && (dir.x !== 0 || dir.z !== 0)) {
      this.body.rotationY = Math.atan2(dir.x, dir.z);
    }
  }
}
