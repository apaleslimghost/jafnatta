import { Action, State } from "../types";

export default (state: State, action: Action) => {
	if(action.type === 'trash') {
		return {
			...state,
			trash: state.trash.add(action.card),
			player: {
				[action.from]: state.player[action.from].remove(action.card)
			}
		}
	}

	return state
}
