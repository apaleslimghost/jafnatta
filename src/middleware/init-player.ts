import { drawAction, gainAction, initPlayerAction } from "../actions"
import { Copper } from "../cards/treasure"
import { Estate } from "../cards/victory"
import { Action, Middleware } from "../types"

const initPlayer: Middleware = store => next => (action: Action) => {
	switch(action.type) {
		case 'init-players':
			next(action)

			store.getState().players.mapKeys(player => {
				store.dispatch(initPlayerAction(player))
			})
			break
		case 'init-player':
			// TODO customisable starting decks (eg Heirlooms)
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Copper, player: action.player }))
			store.dispatch(gainAction({ card: Estate, player: action.player }))
			store.dispatch(gainAction({ card: Estate, player: action.player }))
			store.dispatch(gainAction({ card: Estate, player: action.player }))
			store.dispatch(drawAction(5, action.player))
			break;
		default:
			return next(action);
	}
}

export default initPlayer
