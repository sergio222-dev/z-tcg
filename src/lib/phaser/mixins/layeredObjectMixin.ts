import { GameObjects } from "phaser";

type Constructor = new (...args: any[]) => any

export function layeredObjectMixin<TBase extends Constructor>(base: TBase) {
  return class LayeredObject extends base {
    private currentLayer: GameObjects.Layer;

    setCurrentLayer(layer: GameObjects.Layer): void {
      this.currentLayer = layer;
    }

    getCurrentLayer(): GameObjects.Layer {
      return this.currentLayer;
    }
  }
}
