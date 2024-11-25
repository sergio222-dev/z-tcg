import { GameObjects, Scene } from "phaser";
import { ExtendedLayer }      from "../../../lib/phaser/classes/ExtendedLayer.ts";
import { FACTORY_CONFIG }     from "../../config/configFactory.ts";
import { CardHandViewer }     from "./CardHandViewer.ts";
import { CardOnBoard }        from "./CardOnBoard.ts";
import Zone = GameObjects.Zone;

export class HandLayer extends ExtendedLayer {

  static HAND_ZONE_SIZES    = {
    width:  600,
    height: 150,
  }
  static HAND_ZONE_POSITION = {
    x: 300,
    y: 200,
  }

  static DEPTH = 0;

  static MAX_CARD_DISTANCE  = 100;

  tweenEffect         = 'Bounce.easeOut'
  tweenEffectDuration = 200

  private viewer: CardHandViewer;

  constructor(scene: Scene) {
    super(scene, []);
    this.type = "HandZone";
    this.depth = HandLayer.DEPTH;

    this.createDroppableHandZone()
    this.createViewer()

  }

  get cardInHand() {
    return this.list.filter(x => x.type === 'CardOnBoard').length;
  }

  public addCard(card: CardOnBoard) {
    if (card.isInHand) {
      // get the previous index
      const prevIndex = card.getPreviousIndex()


      if (!prevIndex) {
        this.add(card);
      } else {
        this.addAt(card, prevIndex + 1);
      }
    } else {
      // check if the card is in the layer
      if (!this.list.find(x => x === card)) {

        card.isInHand = true;
        card.setHandContainer(this);

        this.add(card);
      }
    }

    this.sortCards();
  }


  public sortCards() {
    console.log('sorting cards now')
    const cards = this.list.filter(x => x.type === FACTORY_CONFIG.CARD_ON_BOARD) as CardOnBoard[];

    cards.forEach(c => c.isBeingSorted = true);

    if (cards.length === 0) {
      return;
    }

    if (cards.length === 1) {
      const fx = this.scene.tweens.add({
        targets:  cards[0],
        x:        HandLayer.HAND_ZONE_POSITION.x,
        y:        HandLayer.HAND_ZONE_POSITION.y,
        duration: this.tweenEffectDuration,
        ease:     this.tweenEffect
      })

      fx.on('complete', () => {
        cards[0].isBeingSorted = false;
      })

      return;
    }

    // const central_point   = HandZone.HAND_ZONE_SIZES.width * 0.5;
    const maxCardDistance = Math.min(HandLayer.MAX_CARD_DISTANCE,
      (HandLayer.HAND_ZONE_SIZES.width - HandLayer.MAX_CARD_DISTANCE / 2) / cards.length);
    const p               = maxCardDistance * 0.5;
    const N               = cards.length - 1;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      /**
       * Formula explanation:
       *
       */
      const x    = HandLayer.HAND_ZONE_POSITION.x - (p * N) + (maxCardDistance * i);
      const y    = HandLayer.HAND_ZONE_POSITION.y;

      const fx = this.scene.tweens.add({
        targets:  card,
        x,
        y,
        duration: this.tweenEffectDuration,
        ease:     this.tweenEffect
      })

      fx.on('complete', () => {
        cards[i].isBeingSorted = false;
      })
    }
  }

  public viewCard(card: CardOnBoard) {
    this.bringToTop(this.viewer)
    this.viewer.display(card.texture, card.x, card.y, card.displayWidth);
  }

  public hideViewer() {
    this.viewer.hide()
  }

  private createDroppableHandZone() {
    const droppableHandZone = new Zone(this.scene, HandLayer.HAND_ZONE_POSITION.x,
      HandLayer.HAND_ZONE_POSITION.y,
      HandLayer.HAND_ZONE_SIZES.width,
      HandLayer.HAND_ZONE_SIZES.height);

    droppableHandZone.type = FACTORY_CONFIG.HAND_ZONE;
    droppableHandZone.setDropZone()

    this.scene.input.enableDebug(droppableHandZone)

    this.add(droppableHandZone);
  }

  private createViewer() {
    this.viewer = new CardHandViewer(this.scene, 0, 0);

    this.add(this.viewer)
  }
}
