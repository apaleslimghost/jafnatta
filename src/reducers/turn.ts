import { defaultTurnState } from "../state";
import { Action, TurnState } from "../types";
import phases from "./phases";

function commonTurnReduce(
	state: TurnState = defaultTurnState,
	action: Action
): TurnState {
	switch (action.type) {
		case 'add-coin':
			return { ...state, coins: state.coins + action.amount };
		default:
			return state;
	}
}

const phaseReduce = (
	state: TurnState = defaultTurnState,
	action: Action
): TurnState => phases[state.phase](state, action);

const turn = (state: TurnState, action: Action) => commonTurnReduce(phaseReduce(state, action), action);

export default turn
