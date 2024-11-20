import { Pane }   from "tweakpane";
import { CONFIG } from "./config";
// import { Boot }             from './scenes/Boot';
// import { GameOver }         from './scenes/GameOver';
// import { Game as MainGame } from './scenes/Game';
// import { MainMenu }         from './scenes/MainMenu';
import { Game }   from 'phaser';
// import { Preloader }        from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
// const config: Phaser.Types.Core.GameConfig = {
//     type: AUTO,
//     width: 1024,
//     height: 768,
//     parent: 'game-container',
//     backgroundColor: '#028af8',
//     scene: [
//         Boot,
//         Preloader,
//         MainMenu,
//         MainGame,
//         GameOver
//     ]
// };

const config = CONFIG;


const StartGame = (): Game => {


  return new Game(config)

}

export default StartGame;
