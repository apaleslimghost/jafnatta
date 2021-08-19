import { phaseAction } from "../actions"
import { Action, Middleware } from "../types"

const turn: Middleware = store => next => (action: Action) => {
	switch(action.type) {
		case 'turn':
			next(action)
			store.dispatch(phaseAction('action'))
			break
		default:
			next(action)
	}
}

export default turn
