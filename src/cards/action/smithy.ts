import { ThunkDispatch } from "../../types";
import ActionCard from "../action";
import { drawAction } from '../../actions';

export default class Smithy extends ActionCard {
	static cardName = 'Smithy';
	static text = `
		+3 Cards
	`;
	static cost = () => 4;

	async onPlay(dispatch: ThunkDispatch) {
		dispatch(drawAction(3))
	}
}
