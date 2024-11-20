import { Geom, Scene } from "phaser";
import { SceneMixin }  from "../../../lib/phaser/sceneMixin.ts";
import { CardOnBoard } from "../../objects/CardOnBoard.ts";

export class Player1Hand extends SceneMixin(Scene) {
  static name = "1v1Player1Hand";

  HAND_ZONE_SIZES   = {
    width:  400,
    height: 100,
  }
  MAX_CARD_DISTANCE = 100;

  constructor() {
    super(Player1Hand.name);
  }

  init() {
    Player1Hand.registerFactory([
      // {
      //   name: 'HandZone',
      //   factory: function (this: Scene) {
      //     return new
      //   }
      // }
    ])
  }

  create() {
    this.createDropeableHandZone()
  }

  private createDropeableHandZone() {
    const droppableHandZone = this.add.zone(this.scale.width / 2,
      this.scale.height - this.HAND_ZONE_SIZES.height / 2,
      this.HAND_ZONE_SIZES.width,
      this.HAND_ZONE_SIZES.height);

    // droppableHandZone.setOrigin(0)
    // droppableHandZone.setInteractive({
    //   dropZone: true,
    // }, () => false)
    droppableHandZone.setDropZone()
    // droppableHandZone.input!.dropZone = true

    const g = this.add.graphics({
      lineStyle: {
        color: 0xff0000,
        width: 2,
      }
    })

    const sq = new Geom.Rectangle(droppableHandZone.x - droppableHandZone.width / 2,
      droppableHandZone.y - droppableHandZone.height / 2,
      droppableHandZone.width,
      droppableHandZone.height);
    g.strokeRectShape(sq)

    droppableHandZone.on('pointerover', () => {
      console.log('here')
    })

    droppableHandZone.on('drop', () => {
      console.log('drop')
    })

    const c = new CardOnBoard(this, 'card_texture', 10, 10);

    this.add.existing(c)
  }
}
