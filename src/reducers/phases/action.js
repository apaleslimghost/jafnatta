//@flow

export default function action(
	state: TurnState = defaultTurnState,
	action: Action
): TurnState {
	switch (action.type) {
		case 'play-card':
			return { ...state, actions: state.actions - 1 };
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
