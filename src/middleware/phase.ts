import { buyAction, drawAction, moveCardAction, phaseAction } from "../actions";
import { askForCardAction } from "../actions/ask-for-card";
import { askForSupplyCardAction } from "../actions/ask-for-supply-card";
import playCardAction from "../actions/play-card";
import ActionCard from "../cards/action";
import TreasureCard from "../cards/treasure";
import { Colony, Province } from "../cards/victory";
import { Action, Middleware } from "../types";

const phase: Middleware = store => next => async (action: Action) => {
	switch(action.type) {
		case 'phase':
			// run the action so reducer changes phase
			const val = next(action);

			switch(action.phase) {
				case 'action': {
					do {
						const card = await store.dispatch(askForCardAction('hand', ActionCard))

						if(card) {
							await store.dispatch(playCardAction(card))
						} else {
							break
						}
					} while(store.getState().turn.actions > 0)

					store.dispatch(phaseAction('buy'))
					break;
				}
				case 'buy': {
					while(true) {
						const card = await store.dispatch(askForCardAction('hand', TreasureCard))

						if(card) {
							await store.dispatch(playCardAction(card))
						} else {
							break
						}
					}

					while(store.getState().turn.buys > 0) {
						const cardType = await store.dispatch(askForSupplyCardAction(store.getState().turn.coins))
						const { turn } = store.getState()

						if(store.getState().supply.has(cardType)) {
							if(cardType.cost(turn) <= turn.coins) {
								store.dispatch(buyAction(cardType))
							}
						} else {
							break
						}
					}

					store.dispatch(phaseAction('cleanup'))

					break;
				}
				case 'cleanup': {
					while(store.getState().player.inPlay.size) {
						store.dispatch(moveCardAction({
							card: store.getState().player.inPlay.first(),
							from: 'inPlay',
							to: 'discard'
						}))
					}

					while(store.getState().player.hand.size) {
						store.dispatch(moveCardAction({
							card: store.getState().player.hand.first(),
							from: 'hand',
							to: 'discard'
						}))
					}
					store.dispatch(drawAction(5))

					const { supply } = store.getState()
					if(
						supply.has(Province) && supply.get(Province).length === 0
						|| supply.has(Colony) && supply.get(Colony).length === 0
						|| supply.filter(pile => pile.length === 0).size === 3
					) {
						// TODO action for this
						throw new Error('game ended lol')
					}

					store.dispatch(phaseAction('action'))
					break;
				}
			}

			return val
		default:
			next(action)
	}
}

export default phase
