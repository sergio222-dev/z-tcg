import { Scene }                from "phaser";
import { FactoryConfiguration } from "../../lib/phaser/mixins/sceneMixin.ts";
import { FACTORY_CONFIG } from "../config/configFactory.ts";
import { CardOnBoard }    from "../objects/1v1Board/CardOnBoard.ts";

export function CardOnBoardFactory(): FactoryConfiguration {
  return {
    name:    FACTORY_CONFIG.CARD_ON_BOARD,
    factory: function (this: Scene, x: number, y: number) {
      return new CardOnBoard(this, 'card_texture', x, y)
    }
  }
}
