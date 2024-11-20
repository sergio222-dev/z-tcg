import { Board }  from "./Board.ts";
import { Loader } from "./Loader.ts";

export function get1v1BoardScenes() {
  return [
    Loader,
    Board,
    // Player1Hand
  ]
}
