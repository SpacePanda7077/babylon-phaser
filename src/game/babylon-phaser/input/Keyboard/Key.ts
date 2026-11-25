// Key.ts
import { isKeyboardKeyDown, type KeyboardInput } from "@babylonjs/lite";

function toCode(key: string): string {
  if (key.length === 1) {
    if (/[a-z]/i.test(key)) return `Key${key.toUpperCase()}`;
    if (/[0-9]/.test(key)) return `Digit${key}`;
    if (key === " ") return "Space";
  }
  return key; // raw code: "ArrowUp", "Space", "ShiftLeft", ...
}

export class Key {
  key: string;
  keyboardInput: KeyboardInput;

  private wasDown = false;
  private nowDown = false;
  private downAt = 0;

  /** Milliseconds the key has been held in the current press (0 when up). */
  duration = 0;
  /** Milliseconds the most recent completed press lasted. */
  lastDuration = 0;

  constructor(keyboardInput: KeyboardInput, key: string) {
    this.keyboardInput = keyboardInput;
    this.key = toCode(key);
  }

  /** Call exactly once per frame, before anything reads the key. */
  update(delta: number) {
    this.wasDown = this.nowDown;
    this.nowDown = isKeyboardKeyDown(this.keyboardInput, this.key);

    if (this.nowDown) {
      // reset on the frame the press starts, then accumulate
      this.duration = this.wasDown ? this.duration + delta : 0;
    } else if (this.wasDown) {
      this.lastDuration = this.duration;
      this.duration = 0;
    }
  }

  isDown() {
    return this.nowDown;
  }
  isUp() {
    return !this.nowDown;
  }
  justDown() {
    return this.nowDown && !this.wasDown;
  }
  justUp() {
    return !this.nowDown && this.wasDown;
  }
}
