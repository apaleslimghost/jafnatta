import { moveCardAction, shuffleAction } from "../actions";
import { Action, Middleware } from "../types";

const drawCards: Middleware = store => next => (action: Action) => {
	switch (action.type) {
		case 'draw':
			if(action.amount > store.getState().player.deck.size) {
				store.dispatch(shuffleAction())
			}

			for(let i = 0; i < action.amount; i++) {
				const card = store.getState().player.deck.first()

				if(card) {
					store.dispatch(moveCardAction({
						card,
						from: 'deck',
						to: 'hand'
					}))
				}
			}
		default:
			next(action);
	}
}

export default drawCards
