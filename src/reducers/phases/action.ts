
import {TurnState, Action} from '../../types'
import { defaultTurnState } from '../../state'

export default function action(
	state: TurnState,
	action: Action
): TurnState {
	switch (action.type) {
		case 'add-action':
			return { ...state, actions: state.actions + action.amount };
		case 'add-buy':
			return { ...state, buys: state.buys + action.amount };
		case 'phase':
			if (action.phase === 'buy') {
				return { ...state, phase: action.phase };
			} else return state;
		default:
			return state;
	}
}
