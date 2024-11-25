import { GameObjects } from "phaser";

type Constructor = new (...args: any[]) => any

export function layeredObjectMixin<TBase extends Constructor>(base: TBase) {
  return class LayeredObject extends base {
    private currentLayer: GameObjects.Layer;

    setCurrentLayer(layer: GameObjects.Layer): void {
      const oldLayer = this.currentLayer;
      this.currentLayer = layer;

      if (oldLayer) {
        this.currentLayer.remove(this)
      }
    }

    getCurrentLayer(): GameObjects.Layer {
      return this.currentLayer;
    }
  }
}
