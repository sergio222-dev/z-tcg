import { GameObjects, Scene, Textures } from "phaser";
import { EventBus }           from "../EventBus.ts";
import { ASPECTS, getHeight } from "../utils/ratio.ts";
import Texture = Textures.Texture;

export class CardHandViewer extends GameObjects.Image {

  private zoomFactor = 3;
  private isCardBeingDragged = false;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, '');
    this.alpha = 0;

    EventBus.on('carddragstart', () => {
      this.isCardBeingDragged = true;
    })

    EventBus.on('carddragend', () => {
      this.isCardBeingDragged = false;
    })
  }

  display(texture: Texture, x: number, y: number, width?: number, height?: number) {
    if (this.isCardBeingDragged) return;
    this.setPosition(x, y);
    this.setTexture(texture.key)
    this.alpha = 1;
    this.depth = 10;

    if (width) {
      const widthFactor = width * this.zoomFactor;
      this.displayWidth = widthFactor;
      if (height) {
        this.displayHeight = height * this.zoomFactor;

        const adjustY = this.displayHeight / 2 - height

        this.setPosition(x, y - adjustY);
        return
      }

      this.displayHeight = getHeight(widthFactor, ASPECTS['3/4'])
      const calculatedHeight = getHeight(width, ASPECTS['3/4'])
      console.log(`calculatedHeight: ${this.displayHeight / 2 }`)
      const adjustY = this.displayHeight / 2 - calculatedHeight / 2;
      this.setPosition(x, y - adjustY);
    }
  }

  hide() {
    this.alpha = 0;
  }
}
