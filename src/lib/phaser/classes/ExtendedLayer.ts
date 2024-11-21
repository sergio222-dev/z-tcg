import { GameObjects }   from "phaser";
import { LayeredObject } from "../interfaces/LayeredObject.ts";

export class ExtendedLayer extends GameObjects.Layer {
  add(child: unknown | LayeredObject, skipCallback?: boolean): unknown {
    super.add(child, skipCallback);

    // check if the child implements the interface LayeredObject
    if (ExtendedLayer.isLayeredObject(child)) {
      child.setCurrentLayer(this)
    }

    return child;
  }

  static isLayeredObject(child: unknown | LayeredObject): child is LayeredObject {
    return (child as LayeredObject).setCurrentLayer !== undefined;
  }
}
