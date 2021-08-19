import { moveCardAction, shuffleAction } from "../actions";
import { Action, Middleware } from "../types";

const drawCards: Middleware = store => next => (action: Action) => {
	switch (action.type) {
		case 'draw': {
			const player = store.getState().players.get(action.player)

			if(action.amount > player.deck.size) {
				store.dispatch(shuffleAction(action.player))
			}

			for(let i = 0; i < action.amount; i++) {
				const player = store.getState().players.get(action.player)
				const card = player.deck.first()

				if(card) {
					store.dispatch(moveCardAction({
						card,
						from: 'deck',
						to: 'hand',
						player: action.player
					}))
				}
			}

			break
		}
		default:
			next(action);
	}
}

export default drawCards
