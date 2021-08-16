import { addActionAction, drawAction } from "../actions";
import { chooseOneAction } from "../actions/choose-one";
import { ThunkDispatch } from "../types";
import { ActionCard, Card, type, VictoryCard } from "./types";

@type(VictoryCard) @type(ActionCard)
export default class Nobles extends Card {
	static cost = () => 6

	async onPlay(dispatch: ThunkDispatch) {
		const choice = await dispatch(chooseOneAction({
			cards: '+3 cards',
			actions: '+2 actions'
		}))

		switch(choice) {
			case 'cards':
				dispatch(drawAction(3))
				break
			case 'actions':
				dispatch(addActionAction(2))
				break
		}
	}

	getVictoryValue() {
		return 2
	}
}
