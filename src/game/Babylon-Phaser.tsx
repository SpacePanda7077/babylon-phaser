// BabylonPhaser.tsx
import { createEngine, disposeEngine, startEngine } from "@babylonjs/lite";
import { useEffect, useRef } from "react";
import type { Game } from "./babylon-phaser/Game";
import { startGame, stopGame } from "./main";

export default function BabylonPhaser() {
  const reactCanvas = useRef<HTMLCanvasElement | null>(null);
  // Resolves when the previous engine has been fully torn down
  const teardownRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const canvas = reactCanvas.current;
    if (!canvas) return;

    let cancelled = false;
    let engine: Awaited<ReturnType<typeof createEngine>> | null = null;
    let game: Game | null = null;

    const init = (async () => {
      // Wait for any previous engine on this canvas to be disposed first
      await teardownRef.current;
      if (cancelled) return;

      try {
        engine = await createEngine(canvas);
        if (cancelled) return;

        game = await startGame(engine, canvas); // scene is registered when this resolves
        if (cancelled) return;

        await startEngine(engine);
      } catch (e) {
        console.error("Babylon init failed:", e);
      }
    })();

    return () => {
      cancelled = true;
      teardownRef.current = init.then(async () => {
        try {
          if (game) await stopGame(game); // scene first
          if (engine) await disposeEngine(engine); // then engine
        } catch (e) {
          console.error("Babylon dispose failed:", e);
        }
      });
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <canvas
        id="renderCanvas"
        ref={reactCanvas}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
