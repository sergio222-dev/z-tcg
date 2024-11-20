import { Scene } from "phaser";
import { Board } from "./Board.ts";

export class Loader extends Scene {
  static get name() {
    return '1v1BoardLoader';
  }

  constructor() {
    super(Loader.name);
  }

  preload() {
    this.load.image('card_texture', 'https://i.postimg.cc/k5TJPw0B/ACECHANDO-EL-REINO-copia.png')
    this.load.image('card_back', '/assets/img/card_back.png')
    this.load.audio('card_place_1', '/assets/audio/card_place_1.ogg')
    this.load.audio('card_place_2', '/assets/audio/card_place_2.ogg')
  }

  create() {
    this.scene.start(Board.name)
  }
}
