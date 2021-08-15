import { AssertionError } from "assert";
import { askForCardAction } from "../../actions/ask-for-card";
import playCardAction from "../../actions/play-card";
import { ThunkDispatch } from "../../types";
import { ActionCard, Card, type } from "../types";

@type(ActionCard)
export default class ThroneRoom extends Card {
	static displayName = 'Throne Room';
	static text = `
		You may play an Action card from your hand twice.
	`;
	static cost = () => 4;

	async onPlay(dispatch: ThunkDispatch) {
		const [card] = await dispatch(
			askForCardAction('hand', ActionCard)
		);

		if(card) {
			await dispatch(playCardAction(card, {fromCard: true}));
			await dispatch(playCardAction(card, {fromCard: true}));
		}
	}
}
