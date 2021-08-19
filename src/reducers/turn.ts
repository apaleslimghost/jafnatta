import { defaultTurnState } from "../state";
import { Action, TurnState } from "../types";
import phases from "./phases";

function commonTurnReduce(
	state: TurnState = defaultTurnState,
	action: Action
): TurnState {
	switch (action.type) {
		case 'turn':
			return {
				// reset turn state for new player
				...defaultTurnState,
				player: action.player
			}
		case 'add-coin':
			return { ...state, coins: state.coins + action.amount };
		default:
			return state;
	}
}

const phaseReduce = (
	state: TurnState = defaultTurnState,
	action: Action
): TurnState => {
	if(state.phase) {
		return phases[state.phase](state, action)
	} else if('phase' in action) {
		return {
			...state,
			phase: action.phase
		}
	} else {
		return state
	}
}

const turn = (state: TurnState, action: Action) => commonTurnReduce(phaseReduce(state, action), action);

export default turn
