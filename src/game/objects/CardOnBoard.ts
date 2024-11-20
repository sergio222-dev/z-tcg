import { GameObjects, Scene } from 'phaser'
import { CardData }           from "../abstract/CardData.ts";
import { DROPEABLE_TARGETS }  from "../enums/board.ts";
import { Board }              from "../scenes/1v1Board/Board.ts";
import { ASPECTS, getWidth }  from "../utils/ratio.ts";
import { HandZone }           from "./HandZone.ts";
import Pointer = Phaser.Input.Pointer;
import Zone = Phaser.GameObjects.Zone;

export class CardOnBoard extends GameObjects.Sprite implements CardData {

  public image: string;
  public isInHand = false;

  private aspectRatio      = ASPECTS['3/4']
  private initialHeight    = 120;
  private flipDuration     = 65;
  private rotationDuration = 100;
  private isFlipped        = false;
  private isRotated        = false;
  private scaleOnFlip      = 1.4;
  private previousIndex?: number;

  private isBeignDragged = false;

  private readonly cardBackTexture = 'card_back'
  private readonly cardTexture: string;

  constructor(scene: Scene, texture: string, x?: number, y?: number) {
    super(scene, x ?? scene.scale.width / 2, y ?? scene.scale.height / 2, texture);

    this.type        = 'CardOnBoard';
    this.cardTexture = texture;
    this.depth       = 10;

    this.setInteractive({
      draggable: true
    })

    // this.scene.input.enableDebug(this)
    const height = this.initialHeight;

    this.displayWidth  = getWidth(height, this.aspectRatio)
    this.displayHeight = height

    this.setUpMouse()
    this.setUpKeys()

  }

  preUpdate(delta: number, time: number) {
    super.preUpdate(delta, time);

    if (this.isBeignDragged && this.isInHand) {
      const scene = this.getScene();
      const p = this.getHandContainer();
      const pointer = scene.input.activePointer;
      this.x = pointer.x - p.x;
      this.y = pointer.y - p.y;
    }
  }

  private setUpMouse() {
    this.on('dragstart', () => {
      this.isBeignDragged = true;
    })

    this.on('drag', (_pointer: Pointer, x: number, y: number) => {
      this.setPosition(x, y);
    })

    this.on('dragend', () => {
      this.isBeignDragged = false;
    })

    this.on('pointerover', () => {
      this.preFX?.addGlow(0x00aa11, 1)

      if (this.isInHand) {
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

    this.on('pointerup', () => {
      if (!this.isInHand) return;

      // go back to the hand
      const container = this.parentContainer as HandZone

      if (this.previousIndex) {
        container.moveTo(this, this.previousIndex)
        this.previousIndex = undefined;
      }

      container.sortCards();
    })

    this.on('pointerdown', () => {
      if (!this.isInHand) return;

      const container = this.getHandContainer()

      container.hideViewer()

      this.previousIndex = container.getIndex(this)

      container.moveTo(this, container.list.length - 1)
    })

    this.on('drop', (_pointer: Pointer, zone: Zone) => {
      if (zone.type !== DROPEABLE_TARGETS.HAND_ZONE) {
        return;
      }

      const hand = zone.parentContainer as HandZone;
      hand.addCard(this)
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

  private getHandContainer(): HandZone {
    return this.parentContainer as HandZone;
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

