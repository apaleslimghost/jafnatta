import { gainAction } from "../actions"
import { Copper } from "../cards/treasure"
import { Estate } from "../cards/victory"
import { Middleware } from "../types"

const initPlayer: Middleware = store => next => action => {
	switch(action.type) {
		case 'init-player':
			// TODO customisable starting decks (eg Heirlooms)
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Estate }))
			store.dispatch(gainAction({ card: Estate }))
			store.dispatch(gainAction({ card: Estate }))
			break;
		default:
			return next(action);
	}
}

export default initPlayer
