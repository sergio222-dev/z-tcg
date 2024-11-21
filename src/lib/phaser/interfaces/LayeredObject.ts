import { GameObjects } from "phaser";

export interface LayeredObject {
  setCurrentLayer(layer: GameObjects.Layer): void;
  getCurrentLayer(layer: GameObjects.Layer): GameObjects.Layer;
}
