import { moveCardAction, shuffleAction } from "../actions";
import { Action, Middleware } from "../types";

const drawCards: Middleware = store => next => (action: Action) => {
	switch (action.type) {
		case 'draw':
			// TODO Dominion 2E shuffling rules (optional?)
			for(let i = 0; i < action.amount; i++) {
				if(store.getState().player.deck.size === 0) {
					store.dispatch(shuffleAction())
				}

				store.dispatch(moveCardAction({
					card: store.getState().player.deck.first(),
					from: 'deck',
					to: 'hand'
				}))

			}
		default:
			next(action);
	}
}

export default drawCards
