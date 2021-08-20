import { addActionAction, drawAction } from "../actions";
import { chooseOneAction } from "../actions/choose-one";
import { State, ThunkDispatch } from "../types";
import { ActionCard, Card, type, VictoryCard } from "./types";

@type(ActionCard) @type(VictoryCard)
export default class Nobles extends Card {
	static cost = () => 6
	static text = `Choose one: +3 cards; or +2 actions.`

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const choice = await dispatch(chooseOneAction({
			cards: '+3 cards',
			actions: '+2 actions'
		}))

		switch(choice) {
			case 'cards':
				dispatch(drawAction(3, player))
				break
			case 'actions':
				dispatch(addActionAction(2, player))
				break
		}
	}

	getVictoryValue() {
		return 2
	}
}
