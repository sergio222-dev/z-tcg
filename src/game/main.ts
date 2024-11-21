import { CONFIG } from "./config";
import { Game }   from 'phaser';


const config = CONFIG;


const StartGame = (): Game => {


  return new Game(config)

}

export default StartGame;
