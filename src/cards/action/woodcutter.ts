import { addBuyAction, addCoinAction } from "../../actions";
import { State, ThunkDispatch } from "../../types";
import { ActionCard, Card, type } from "../types";

@type(ActionCard)
export default class Woodcutter extends Card {
	static displayName = 'Woodcutter';
	static text = `
		+1 Buy
		+$2
	`;
	static cost = () => 3;

	onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		dispatch(addBuyAction(1, player));
		dispatch(addCoinAction(2, player));
	}
}
