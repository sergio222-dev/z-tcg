import { GameObjects, Scene } from "phaser";
import { DROPEABLE_TARGETS }  from "../enums/board.ts";
import { CardHandViewer }     from "./CardHandViewer.ts";
import { CardOnBoard }        from "./CardOnBoard.ts";
import Zone = Phaser.GameObjects.Zone;

export class HandZone extends GameObjects.Container {

  static HAND_ZONE_SIZES   = {
    width:  600,
    height: 150,
  }
  static MAX_CARD_DISTANCE = 100;

  tweenEffect         = 'Bounce.easeOut'
  tweenEffectDuration = 200

  private viewer: CardHandViewer;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, []);
    this.type = "HandZone";
    this.depth = 10;

    this.createDroppableHandZone()
    this.createViewer()
  }

  get cardInHand() {
    return this.list.filter(x => x.type === 'CardOnBoard').length;
  }

  public addCard(card: CardOnBoard) {

    if (!this.list.find(x => x === card)) {
      this.add(card);
    }
    this.sortCards();
  }

  public sortCards() {
    const cards = this.list.filter(x => x.type === 'CardOnBoard') as CardOnBoard[];

    if (cards.length === 0) {
      return;
    }

    if (cards.length === 1) {
      const card = cards[0];

      if (!card.isInHand) {
        card.isInHand          = true;
        const [localX, localY] = this.transformToLocal(cards[0].x, cards[0].y)
        card.x                 = localX;
        card.y                 = localY;
      }

      this.scene.tweens.add({
        targets:  cards[0],
        x:        0,
        y:        0,
        duration: this.tweenEffectDuration,
        ease:     this.tweenEffect
      })

      return;
    }

    // const central_point   = HandZone.HAND_ZONE_SIZES.width * 0.5;
    const maxCardDistance = Math.min(HandZone.MAX_CARD_DISTANCE, (HandZone.HAND_ZONE_SIZES.width - 50) / cards.length);
    const p               = maxCardDistance * 0.5;
    const N               = cards.length - 1;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      /**
       * Formula explanation:
       *
       */

      if (!card.isInHand) {
        card.isInHand          = true;
        const [localX, localY] = this.transformToLocal(card.x, card.y)
        card.x                 = localX;
        card.y                 = localY;
      }

      const x = 0 - (p * N) + (maxCardDistance * i);
      const y = 0;

      this.scene.tweens.add({
        targets:  card,
        x,
        y,
        duration: this.tweenEffectDuration,
        ease:     this.tweenEffect
      })
    }
  }

  public viewCard(card: CardOnBoard) {
    this.bringToTop(this.viewer)
    this.viewer.display(card.texture.key, card.x, card.y, card.displayWidth);
  }

  public hideViewer() {
    this.viewer.hide()
  }

  private createDroppableHandZone() {
    const droppableHandZone = new Zone(this.scene, 0,
      0,
      HandZone.HAND_ZONE_SIZES.width,
      HandZone.HAND_ZONE_SIZES.height);

    droppableHandZone.type = DROPEABLE_TARGETS.HAND_ZONE;
    droppableHandZone.setDropZone()

    this.scene.input.enableDebug(droppableHandZone)

    this.add(droppableHandZone);
  }

  private createViewer() {
    this.viewer = new CardHandViewer(this.scene, this.x, this.y);

    this.add(this.viewer)
  }

  private transformToLocal(x: number, y: number) {
    return [x - this.x, y - this.y]
  }
}
