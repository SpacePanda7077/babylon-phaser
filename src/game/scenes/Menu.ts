import { Scene } from "../babylon-phaser/scene/Scene";
import type { WasdKeys } from "../babylon-phaser/input/Keyboard/Keyboard";
import { Player } from "./Player/Player";
import { InputHandler } from "./Inputs/input";

export class Menu extends Scene {
  static key = "Menu";
  d: WasdKeys;

  player: Player;
  input_handler: InputHandler;

  constructor() {
    super();
  }
  async create() {
    this.camera.attachControl(true);
    this.player = new Player(this);
    this.input_handler = new InputHandler(this);
  }
  update(delta: number): void {
    this.input_handler.update();
    this.player.update(this.input_handler.input_vector, delta);
  }
}
