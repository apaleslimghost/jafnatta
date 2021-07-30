import { addBuyAction, addCoinAction } from "../../actions";
import { ThunkDispatch } from "../../types";
import ActionCard from "../action";

export default class Woodcutter extends ActionCard {
	static cardName = 'Woodcutter';
	static text = `
		+1 Buy
		+$2
	`;
	static cost = () => 3;

	onPlay(dispatch: ThunkDispatch) {
		dispatch(addBuyAction(1));
		dispatch(addCoinAction(2));
	}
}
