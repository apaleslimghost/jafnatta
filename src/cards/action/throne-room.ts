import { AssertionError } from "assert";
import { askForCardAction } from "../../actions/ask-for-card";
import playCardAction from "../../actions/play-card";
import { ThunkDispatch } from "../../types";
import ActionCard from "../action";

export default class ThroneRoom extends ActionCard {
	static cardName = 'Throne Room';
	static text = `
		You may play an Action card from your hand twice.
	`;
	static cost = () => 4;

	async onPlay(dispatch: ThunkDispatch) {
		const { card } = await dispatch(
			askForCardAction('hand', ActionCard)
		);

		if(card) {
			if(!(card instanceof ActionCard)) throw new AssertionError({
				message: 'Should have returned an ActionCard',
				expected: ActionCard,
				actual: card.constructor
			})

			await dispatch(playCardAction(card, {fromCard: true}));
			await dispatch(playCardAction(card, {fromCard: true}));
		}
	}
}
