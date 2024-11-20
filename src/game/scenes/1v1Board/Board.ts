import { Scene } from "phaser";
import { SceneMixin }  from "../../../lib/phaser/sceneMixin.ts";
import { CardOnBoard } from "../../objects/CardOnBoard.ts";
import { HandZone }    from "../../objects/HandZone.ts";

export class Board extends SceneMixin(Scene) {
  static get name (): string { return '1v1Board'; }

  cardUnderPointer?: CardOnBoard;

  constructor() {
    super(Board.name);
  }

  init() {
    Board.registerFactory([
      {
        name: 'cardOnBoard',
        factory: function (this: Scene, x: number, y: number) {
          return new CardOnBoard(this,'card_texture', x, y);
        }
      }
    ])
  }

  create() {
    this.drawDebugFeatures()
    const z = new HandZone(this, this.scale.width / 2, this.scale.height - HandZone.HAND_ZONE_SIZES.height / 2)
    this.children.add(z)

    const middlePoint = {
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.5,
    }

    for (let i = 0; i < 8; i++) {
      this.addAny('cardOnBoard', middlePoint.x + 10 * i, middlePoint.y);
    }

    this.children.bringToTop(z)
  }

  setCardUnderPointer(card: CardOnBoard): void {
    this.cardUnderPointer = card;
  }

  private drawDebugFeatures() {
    const g = this.add.graphics({
      lineStyle: {
        width: 3,
        color: 0x0000ff,
      }
    })

    g.beginPath();
    g.moveTo(this.scale.width / 2, 0);
    g.lineTo(this.scale.width / 2, this.scale.height)
    g.closePath();
    g.strokePath();

    g.beginPath()
    g.moveTo(0, this.scale.height / 2)
    g.lineTo(this.scale.width, this.scale.height / 2)
    g.closePath()
    g.strokePath()
  }
}
