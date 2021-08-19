import { gainAction } from "../actions";
import { Action, Middleware } from "../types";

const buyCard: Middleware = store => next => (action: Action) => {
	switch (action.type) {
		case 'buy-card':
			const { phase, buys } = store.getState().turn;
			if (phase === 'buy' && buys >= 1) {
				// let the phase reducer handle turn state changes before gaining
				const val = next(action);

				store.dispatch(gainAction({
					card: action.card,
					player: action.player
				}));

				return val;
			}
			break;
		default:
			return next(action);
	}
};

export default buyCard
