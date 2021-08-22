import { drawAction, gainAction, initPlayerAction, turnAction } from "../actions"
import { Witch } from "../cards/action"
import { Copper } from "../cards/treasure"
import { Estate } from "../cards/victory"
import { Action, Middleware } from "../types"

const initPlayer: Middleware = store => next => (action: Action) => {
	switch(action.type) {
		case 'init-players':
			store.getState().players.mapKeys(player => {
				store.dispatch(initPlayerAction(player))
			})

			const playerIds = store.getState().players.keySeq()

			store.dispatch(turnAction(
				playerIds.get(Math.floor(playerIds.size * Math.random()))
			))

			break
		case 'init-player':
			// TODO customisable starting decks (eg Heirlooms)
			// TODO these cards aren't actually gained, right?
			store.dispatch(gainAction({ card: Witch, player: action.player }))
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
