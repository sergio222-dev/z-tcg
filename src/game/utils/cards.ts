import { CardOnBoard } from "../objects/1v1Board/CardOnBoard.ts";

export function checkIfCard(card: CardOnBoard | unknown): card is CardOnBoard {
  return typeof (card as CardOnBoard).isInHand !== 'undefined';


}
