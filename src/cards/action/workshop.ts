import { GetState, State, ThunkDispatch } from "../../types";
import { drawAction, gainAction } from '../../actions';
import { askForSupplyCardAction } from "../../actions/ask-for-supply-card";
import { ActionCard, Card, type } from "../types";

@type(ActionCard)
export default class Workshop extends Card {
	static displayName = 'Workshop';
	static text = `
		gain
	`;
	static cost = () => 3;

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const card = await dispatch(
			askForSupplyCardAction(4)
		);

		if(card) {
			dispatch(gainAction({ card, player }));
		}
	}
}
