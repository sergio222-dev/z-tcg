import { Types, Scale }      from 'phaser'
// import { DefaultPluginsConfig } from 'phaser-plugin-inspector'
import { get1v1BoardScenes } from "../scenes/1v1Board";

export const CONFIG: Types.Core.GameConfig = {
  type:        Phaser.AUTO,
  transparent: true,
  backgroundColor: 'white',
  autoRound:       false,
  disableContextMenu: true,
  title: 'z-rpg',
  fps: {
    min: 60,
    target: 60,
    smoothStep: true,
  },
  scale:           {
    parent:     'game-container',
    mode:       Phaser.Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
    width: window.devicePixelRatio * window.innerWidth,
    height: window.devicePixelRatio * window.innerHeight,
    // min:        {
    //   width:  800,
    //   height: 600,
    // },
    // max:        {
    //   width:  2000,
    //   height: 1080,
    // },
    zoom:       1
  },
  scene:           [
    ...get1v1BoardScenes()
  ],
  // plugins: DefaultPluginsConfig,
}
