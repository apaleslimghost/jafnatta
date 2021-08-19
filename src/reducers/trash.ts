import { Action, State } from "../types";

export default (state: State, action: Action) => {
	if(action.type === 'trash') {
		return {
			...state,
			trash: state.trash.add(action.card),
			players: state.players.update(action.player, player => ({
				...player,
				[action.from]: player[action.from].remove(action.card)
			}))
		}
	}

	return state
}
