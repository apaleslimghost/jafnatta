import { State, ThunkDispatch } from "../../types";
import { drawAction } from '../../actions';
import { ActionCard, Card, type } from "../types";

@type(ActionCard)
export default class Smithy extends Card {
	static displayName = 'Smithy';
	static text = `
		+3 Cards
	`;
	static cost = () => 4;

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		dispatch(drawAction(3, player))
	}
}
