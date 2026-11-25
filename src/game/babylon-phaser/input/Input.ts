import { KeyBoard } from "./Keyboard/Keyboard";

export class Input {
  keyBoard: KeyBoard;
  constructor() {
    this.keyBoard = new KeyBoard();
  }
  update(deltaMs: number) {
    this.keyBoard.update(deltaMs);
  }
  destroy() {
    this.keyBoard.destroy();
  }
}
