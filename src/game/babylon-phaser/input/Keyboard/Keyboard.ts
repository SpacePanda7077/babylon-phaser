// KeyBoard.ts
import {
  createKeyboardInput,
  disposeKeyboardInput,
  type KeyboardInput,
} from "@babylonjs/lite";
import { Key } from "./Key";

export type CursorKeys = {
  up: Key;
  down: Key;
  left: Key;
  right: Key;
  space: Key;
  shift: Key;
};

export type WasdKeys = {
  w: Key;
  a: Key;
  s: Key;
  d: Key;
};

export class KeyBoard {
  keys: KeyboardInput;
  private registered = new Map<string, Key>();

  constructor() {
    this.keys = createKeyboardInput(window);
  }

  addKey(key: string): Key {
    const existing = this.registered.get(key);
    if (existing) return existing;

    const key_input = new Key(this.keys, key);
    this.registered.set(key, key_input);
    return key_input;
  }

  createCursorKeys(): CursorKeys {
    return {
      up: this.addKey("ArrowUp"),
      down: this.addKey("ArrowDown"),
      left: this.addKey("ArrowLeft"),
      right: this.addKey("ArrowRight"),
      space: this.addKey("Space"),
      shift: this.addKey("ShiftLeft"),
    };
  }

  addWASD(): WasdKeys {
    return {
      w: this.addKey("w"),
      a: this.addKey("a"),
      s: this.addKey("s"),
      d: this.addKey("d"),
    };
  }

  /** Call once per frame, before scene update. */
  update(deltaMs: number) {
    for (const k of this.registered.values()) k.update(deltaMs);
  }

  destroy() {
    this.registered.clear();
    disposeKeyboardInput(this.keys);
  }
}
