import { defaultState } from "../state";
import { Action, State } from "../types";

export default function gainCardReducer(state: State = defaultState, action: Action): State {
	switch (action.type) {
		case 'gain-card':
			const [card, ...remaining] = state.supply.get(action.card);
			return {
				...state,
				player: {
					...state.player,
					[action.where]: state.player[action.where].concat([card]),
				},
				supply: state.supply.set(action.card, remaining),
			};
		default:
			return state;
	}
}
