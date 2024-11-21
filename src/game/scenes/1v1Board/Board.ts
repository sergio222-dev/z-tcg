import { Scene }                                      from "phaser";
import { SceneMixin }                                 from "../../../lib/phaser/mixins/sceneMixin.ts";
import { FACTORY_CONFIG }                             from "../../config/configFactory.ts";
import { CardOnBoardFactory, LayeredExtendedFactory } from "../../factories";
import { CardOnBoard }                                from "../../objects/CardOnBoard.ts";
import { HandContainer }                              from "../../objects/HandContainer.ts";
import Clone = Phaser.Utils.Objects.Clone;

export class Board extends SceneMixin(Scene) {
  static get name(): string {
    return '1v1Board';
  }

  cardUnderPointer?: CardOnBoard;

  private handContainerP1: HandContainer;

  constructor() {
    super(Board.name);
  }

  init() {
    Board.registerFactory([
      CardOnBoardFactory(),
      LayeredExtendedFactory()
    ])
  }

  create() {
    this.drawDebugFeatures()

    // set layers

    // EventBus.on('movingCard', () => console.log('movingCard'))
    // create hand zone for P1
    const handContainer  = new HandContainer(this,
      this.scale.width / 2,
      this.scale.height - HandContainer.HAND_ZONE_SIZES.height / 2)
    this.handContainerP1 = handContainer
    this.add.existing(handContainer)

    const middlePoint = {
      x: this.scale.width * 0.5,
      y: this.scale.height * 0.5,
    }

    this.addAny(FACTORY_CONFIG.CARD_ON_BOARD, middlePoint.x + Math.random() * 500, middlePoint.y)
    this.addAny(FACTORY_CONFIG.CARD_ON_BOARD, middlePoint.x + Math.random() * 500, middlePoint.y)
    this.addAny(FACTORY_CONFIG.CARD_ON_BOARD, middlePoint.x + Math.random() * 500, middlePoint.y)
    this.addAny(FACTORY_CONFIG.CARD_ON_BOARD, middlePoint.x + Math.random() * 500, middlePoint.y)

    // random cards
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handContainer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))

    this.children.bringToTop(handContainer)

    // for (let i = 0; i < 2; i++) {
    //   // this.addAny('cardOnBoard', middlePoint.x, middlePoint.y + Math.floor(i / 3));
    // }
  }

  setCardUnderPointer(card: CardOnBoard): void {
    this.cardUnderPointer = card;
  }

  addCardToHand(card: CardOnBoard): void {
    this.handContainerP1.addCard(card);
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
