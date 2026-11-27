// game-objects/Shadows.ts
import { setShadowTaskCasterMeshes, type Mesh } from "@babylonjs/lite";

/** Whatever `light.shadowGenerator` holds (ESM / PCF generator). */
type ShadowGenerator = Parameters<typeof setShadowTaskCasterMeshes>[0];

/**
 * Tracks which meshes cast shadows and pushes the list to the shadow generator.
 * Babylon Lite has no `addShadowCaster`: the whole caster list is replaced via
 * `setShadowTaskCasterMeshes`, so we keep the set here and re-send it on change.
 */
class ShadowRegistry {
  private casters = new Set<Mesh>();
  private generator: ShadowGenerator | null = null;

  /**
   * Call once after creating the light's shadow generator:
   * `light.shadowGenerator = createPcfDirectionalShadowGenerator(...)`
   * `shadows.bind(light.shadowGenerator)`
   */
  bind(generator: ShadowGenerator) {
    this.generator = generator;
    this.casters.clear(); // new scene/light: drop casters from the old one
    this.flush();
  }

  add(meshes: Mesh[]) {
    meshes.forEach((m) => this.casters.add(m));
    this.flush();
  }

  remove(meshes: Mesh[]) {
    meshes.forEach((m) => this.casters.delete(m));
    this.flush();
  }

  get count() {
    return this.casters.size;
  }

  private flush() {
    if (this.generator) {
      setShadowTaskCasterMeshes(this.generator, [...this.casters]);
    }
  }
}

/** Shared registry used by Shape and Model `castShadow`. */
export const shadows = new ShadowRegistry();
