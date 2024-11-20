import { GameObjects, Scene } from "phaser";
import { ASPECTS, getHeight } from "../utils/ratio.ts";

export class CardHandViewer extends GameObjects.Image {

  private zoomFactor = 3;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, '');
    this.alpha = 0;
  }

  display(texture: string, x: number, y: number, width?: number, height?: number) {
    this.setPosition(x, y);
    this.setTexture(texture);
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
