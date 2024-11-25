import { GameObjects }   from "phaser";
import { LayeredObject } from "../interfaces/LayeredObject.ts";

export class ExtendedLayer extends GameObjects.Layer {
  add(child: unknown | LayeredObject, skipCallback?: boolean): unknown {

    // check if the child implements the interface LayeredObject
    if (ExtendedLayer.isLayeredObject(child)) {
      child.setCurrentLayer(this)
    }

    return super.add(child, skipCallback);
  }

  addAt(child: GameObjects.GameObject[] | GameObjects.GameObject,
        index?: number,
        skipCallback?: boolean): GameObjects.GameObject[] | GameObjects.GameObject {

    if (ExtendedLayer.isLayeredObject(child)) {
      child.setCurrentLayer(this)
    }

    return super.addAt(child, index, skipCallback);
  }

  static isLayeredObject(child: unknown | LayeredObject): child is LayeredObject {
    return (child as LayeredObject).setCurrentLayer !== undefined;
  }
}
