import { GameObjects, Scene }                         from "phaser";
import { ExtendedLayer }                              from "../../../lib/phaser/classes/ExtendedLayer.ts";
import { SceneMixin }                                 from "../../../lib/phaser/mixins/sceneMixin.ts";
import { FACTORY_CONFIG }                             from "../../config/configFactory.ts";
import { CardOnBoardFactory, LayeredExtendedFactory } from "../../factories";
import { CardOnBoard }                                from "../../objects/1v1Board/CardOnBoard.ts";
import { HandLayer }                                  from "../../objects/1v1Board/HandLayer.ts";
import { ONE_V_ONE_BOARD_CONFIGURATION }              from "./config.ts";

export class Board extends SceneMixin(Scene) {
  static get name(): string {
    return '1v1Board';
  }

  cardUnderPointer?: CardOnBoard;

  private handContainerP1: HandLayer;
  private topLayer: GameObjects.Layer;
  private boardLayer: GameObjects.Layer;

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
    // this.drawDebugFeatures()

    this.configureHandLayer();
    this.setupHandLayer()

    // setup board layer
    const boardLayer = this.addAny<ExtendedLayer>(FACTORY_CONFIG.EXTENDED_LAYER)
    boardLayer.setDepth(ONE_V_ONE_BOARD_CONFIGURATION.depths.board_layer)
    boardLayer.name = ONE_V_ONE_BOARD_CONFIGURATION.names.board_layer
    this.boardLayer = boardLayer;

    // setup top layer
    const topLayer = this.addAny<ExtendedLayer>(FACTORY_CONFIG.EXTENDED_LAYER)
    topLayer.name = ONE_V_ONE_BOARD_CONFIGURATION.names.top_layer
    topLayer.setDepth(ONE_V_ONE_BOARD_CONFIGURATION.depths.top_layer)
    this.topLayer = topLayer;

    // add random cards
    const middlePoint = {
      x: this.scale.width * 0.3,
      y: this.scale.height * 0.7,
    }

    for (let i = 0; i < 7; i++) {
      const s = this.addAny(FACTORY_CONFIG.CARD_ON_BOARD, middlePoint.x + Math.random() * 500, middlePoint.y)
      boardLayer.add(s)
    }
  }

  setCardUnderPointer(card: CardOnBoard): void {
    this.cardUnderPointer = card;
  }

  addCardToHand(card: CardOnBoard): void {
    this.handContainerP1.addCard(card);
  }

  addCardToBoard(card: CardOnBoard): void {
    this.boardLayer.add(card);
  }

  addCartToTopLayer(card: CardOnBoard): void {
    this.topLayer.add(card);
  }

  hideViewer() {
    this.handContainerP1.hideViewer();
  }

  private configureHandLayer() {
    HandLayer.HAND_ZONE_SIZES    = {
      width:  ONE_V_ONE_BOARD_CONFIGURATION.size.hand_zone.width * this.scale.width,
      height: ONE_V_ONE_BOARD_CONFIGURATION.size.hand_zone.height * this.scale.height,
    }
    HandLayer.HAND_ZONE_POSITION = {
      x: ONE_V_ONE_BOARD_CONFIGURATION.positions.hand_zone.x * this.scale.width,
      y: ONE_V_ONE_BOARD_CONFIGURATION.positions.hand_zone.y * this.scale.height,
    }
    HandLayer.DEPTH = ONE_V_ONE_BOARD_CONFIGURATION.depths.hand_layer
  }

  private setupHandLayer() {
    const handLayer      = new HandLayer(this)
    this.handContainerP1 = handLayer
    this.add.existing(handLayer)

    // random cards
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
    handLayer.addCard(new CardOnBoard(this, 'card_texture', 0, 0))
  }

  // private drawDebugFeatures() {
  //   const g = this.add.graphics({
  //     lineStyle: {
  //       width: 3,
  //       color: 0x0000ff,
  //     }
  //   })
  //
  //   g.beginPath();
  //   g.moveTo(this.scale.width / 2, 0);
  //   g.lineTo(this.scale.width / 2, this.scale.height)
  //   g.closePath();
  //   g.strokePath();
  //
  //   g.beginPath()
  //   g.moveTo(0, this.scale.height / 2)
  //   g.lineTo(this.scale.width, this.scale.height / 2)
  //   g.closePath()
  //   g.strokePath()
  // }
}
