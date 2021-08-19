import { addActionAction, drawAction } from "../actions";
import { chooseOneAction } from "../actions/choose-one";
import { State, ThunkDispatch } from "../types";
import { ActionCard, Card, type, VictoryCard } from "./types";

@type(VictoryCard) @type(ActionCard)
export default class Nobles extends Card {
	static cost = () => 6

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
