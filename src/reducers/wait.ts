import { Action, WaitState } from "../types";

export default function wait(state: WaitState = {}, action: Action): WaitState {
	switch (action.type) {
		case 'wait-for-action':
			return {
				...state,
				action: action.action,
				promise: action.promise,
			};
		case state.action:
			if (state.promise) {
				state.promise.resolve(action);
			}

			return {};
		default:
			return state;
	}
}
