import { AssertionError } from "assert";
import { askForCardAction } from "../../actions/ask-for-card";
import playCardAction from "../../actions/play-card";
import { State, ThunkDispatch } from "../../types";
import { ActionCard, Card, type } from "../types";

@type(ActionCard)
export default class ThroneRoom extends Card {
	static displayName = 'Throne Room';
	static text = `
		You may play an Action card from your hand twice.
	`;
	static cost = () => 4;

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const [card] = await dispatch(
			askForCardAction('hand', ActionCard, player)
		);

		if(card) {
			await dispatch(playCardAction(card, player, {fromCard: true}));
			await dispatch(playCardAction(card, player, {fromCard: true}));
		}
	}
}
