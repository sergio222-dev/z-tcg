import * as Phaser            from "phaser";
import { GameObjects, Scene } from "phaser";
import { layeredObjectMixin } from "../../../lib/phaser/mixins/layeredObjectMixin.ts";
import { CardData }           from "../../abstract/CardData.ts";
import { FACTORY_CONFIG }     from "../../config/configFactory.ts";
import { EventBus }           from "../../EventBus.ts";
import { Board }              from "../../scenes/1v1Board/Board.ts";
import { ASPECTS, getWidth }  from "../../utils/ratio.ts";
import { HandLayer }          from "./HandLayer.ts";
import { v4 as UUID }         from 'uuid'

import Zone = Phaser.GameObjects.Zone;
import Pointer = Phaser.Input.Pointer;

export class CardOnBoard extends layeredObjectMixin(GameObjects.Sprite) implements CardData {

  public image: string;
  public isInHand      = false;
  public isBeingSorted = false;

  private aspectRatio      = ASPECTS['3/4']
  private initialHeight    = 120;
  private flipDuration     = 65;
  private rotationDuration = 100;
  private isFlipped        = false;
  private isRotated        = false;
  private scaleOnFlip      = 1.4;
  private previousIndex?: number;
  private handContainer: HandLayer;
  // private isBeingDragged   = false;

  private readonly cardBackTexture = 'card_back'
  private readonly cardTexture: string;

  constructor(scene: Scene, texture: string, x?: number, y?: number) {
    super(scene, x ?? scene.scale.width / 2, y ?? scene.scale.height / 2, texture);

    this.name = UUID()

    this.type        = FACTORY_CONFIG.CARD_ON_BOARD;
    this.cardTexture = texture;
    this.depth       = 10;

    this.setInteractive({
      draggable: true
    })

    const height = this.initialHeight;

    this.displayWidth  = getWidth(height, this.aspectRatio)
    this.displayHeight = height

    this.setUpMouse()
    this.setUpKeys()
  }

  public getHandContainer(): HandLayer {
    if (!this.handContainer) {
      throw new Error('Card not in a hand container')
    }
    return this.handContainer;
  }

  public setHandContainer(handContainer: HandLayer): void {
    this.handContainer = handContainer;
  }

  public getPreviousIndex(): number | undefined {
    return this.previousIndex;
  }

  private setUpMouse() {
    this.on('dragstart', () => {
      if (this.isBeingSorted) return;
      EventBus.emit('carddragstart', this);

      const scene         = this.getScene();
      // this.isBeingDragged = true;

      if (this.isInHand) {
        const layer = this.getCurrentLayer();

        if (!layer) {
          throw new Error('Card not in a hand layer')
        }

        this.previousIndex = layer.getIndex(this)
        console.log(this.previousIndex)
      }


      scene.addCartToTopLayer(this)
      // fix position
      const { x, y } = scene.input.activePointer;
      this.x         = x;
      this.y         = y;
    })

    this.on('drag', (_pointer: Pointer) => {
      if (this.isBeingSorted) return;
      // dragX and dragY are returning incorrect values, maybe is taking on count the real width of the texture?
      this.setPosition(_pointer.x, _pointer.y);
    })

    this.on('dragend', () => {
      this.isBeingDragged = false;
      EventBus.emit('carddragend')

      const scene         = this.getScene();

      if (this.isInHand) {
        scene.addCardToHand(this)
      } else {
        // moe card to the board again
        scene.addCardToBoard(this)
      }
    })

    this.on('pointerover', () => {
      this.preFX?.addGlow(0x00aa11, 1)

      if (this.isInHand) {
        // TODO: viewer should work as events
        const container = this.getHandContainer()

        container.viewCard(this)
      }

      const scene            = this.getScene();
      scene.cardUnderPointer = this;
    })

    this.on('pointerout', () => {
      this.preFX?.clear()

      const scene            = this.getScene();
      scene.cardUnderPointer = undefined;

      if (!this.isInHand) return

      const container = this.getHandContainer()
      container.hideViewer()
    })

    // this.on('pointerup', () => {
    //   if (!this.isInHand || this.isBeingSorted) return;
    //
    //   // go back to the hand
    //
    //   // const scene = this.getScene();
    //
    //   // scene.addCardToHand(this);
    //
    //
    //   // if (this.previousIndex) {
    //   //   // container.moveTo(this, this.previousIndex)
    //   //   // this.previousIndex = undefined;
    //   // }
    //
    //   // container.sortCards();
    // })

    this.on('pointerdown', () => {
      if (this.isBeingSorted) return;
      EventBus.emit('movingCard', this)

      // fix position
      const scene = this.getScene();
      this.x      = scene.input.activePointer.x;
      this.y      = scene.input.activePointer.y;

      // TODO: should be managed by an event in the viewer, Demeter law
      scene.hideViewer()
    })

    this.on('drop', (_pointer: Pointer, zone: Zone) => {
      if (zone.type !== FACTORY_CONFIG.HAND_ZONE) {
        return;
      }

      if (this.isInHand) return

      const scene = this.getScene();
      scene.addCardToHand(this);
    })
  }

  private setUpKeys() {
    // keys
    const f = this.scene.input.keyboard?.addKey('f')
    const r = this.scene.input.keyboard?.addKey('r')

    f!.on('down', () => {
      const scene = this.getScene();

      if (scene.cardUnderPointer === this) {
        this.flipCard()
      }
    })
    r!.on('down', () => {
      const scene = this.getScene();

      if (scene.cardUnderPointer === this) {
        this.rotate();
      }
    })
  }

  private flipCard(): void {
    const scene = this.getScene();

    // scene.sound.play('card_place_1')

    const f = scene.tweens.add({
      targets:       this,
      duration:      this.flipDuration,
      displayWidth:  0,
      displayHeight: this.initialHeight * this.scaleOnFlip,
    })

    const bf = scene.tweens.add({
      targets:       this,
      duration:      this.flipDuration,
      displayWidth:  getWidth(this.initialHeight, this.aspectRatio),
      displayHeight: this.initialHeight,
      paused:        true,
    })

    f.on('complete', () => {
      this.setTexture(this.isFlipped ? this.cardTexture : this.cardBackTexture)
      this.setDisplaySize(0, this.initialHeight)
      this.isFlipped = !this.isFlipped
      bf.play();
    })

  }

  private rotate(): void {
    const scene = this.getScene();

    // scene.sound.play('card_place_2')

    if (!this.isRotated) {
      const r = scene.tweens.add({
        targets:  this,
        angle:    90,
        duration: this.rotationDuration,
        ease:     'bounce'
      })

      r.on('complete', () => {
        this.isRotated = true;
      })
    } else {
      const r = scene.tweens.add({
        targets:  this,
        angle:    0,
        duration: this.rotationDuration,
        ease:     'bounce'
      })

      r.on('complete', () => {
        this.isRotated = false;
      })
    }
  }

  private getScene(): Board {
    return this.scene as Board;
  }


}

