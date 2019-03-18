
import {TurnState, Action} from '../../types'

const buy = (state: TurnState, action: Action) => {
	switch (action.type) {
		case 'phase':
			if (action.phase === 'cleanup') {
				return { ...state, phase: action.phase };
			} else return state;
		case 'buy-card':
			return {
				...state,
				coins: state.coins - action.card.cost(state),
				buys: state.buys - 1,
			};
		default:
			return state;
	}
};

export default buy;