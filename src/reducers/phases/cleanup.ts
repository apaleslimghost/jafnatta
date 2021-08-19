
import {TurnState, Action} from '../../types'

const cleanup = (state: TurnState, action: Action) => {
	switch(action.type) {
		case 'phase':
			if (action.phase === 'action') {
				return { ...state, phase: action.phase };
			} else return state;
		default:
			return state
	}
}

export default cleanup;
