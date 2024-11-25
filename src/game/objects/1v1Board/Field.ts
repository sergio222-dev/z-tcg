import { Scene, FX } from 'phaser'
import Plane = Phaser.GameObjects.Plane;

export class Field extends Plane {

  // private defaultSizes = {
  //   width: 100,
  //   height: 100,
  // }

  private currentEffect: FX.Controller | null = null;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'field_texture');

    if (this.input) {
      this.input.enabled = true;
    }

    this.setInteractive({
      dropZone: true,
    })
    // this.width = this.defaultSizes.width;
    // this.height = this.defaultSizes.height;

    // this.scene.add.existing(this)
    this.width=10
    this.height=10

    this.on('pointerover', () => {
      // this.currentEffect = this.postFX.addBloom(0xffffff)
      this.currentEffect = this.postFX.addGlow(0x00ffff, 2, 1, false, 1, 10)

    })

    this.on('pointerout', () => {
      if (!this.currentEffect) return
      this.postFX.remove(this.currentEffect)
    })
  }

}
