import { Scene }                from "phaser";
import { ExtendedLayer }        from "../../lib/phaser/classes/ExtendedLayer.ts";
import { FactoryConfiguration } from "../../lib/phaser/mixins/sceneMixin.ts";
import { FACTORY_CONFIG }       from "../config/configFactory.ts";

export function LayeredExtendedFactory(): FactoryConfiguration {
  return {
    name: FACTORY_CONFIG.EXTENDED_LAYER,
    factory: function (this: Scene) {
      return new ExtendedLayer(this);
    }
  }
}
