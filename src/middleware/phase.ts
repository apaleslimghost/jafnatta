import { buyAction, drawAction, moveCardAction, phaseAction } from "../actions";
import { askForCardAction } from "../actions/ask-for-card";
import { askForSupplyCardAction } from "../actions/ask-for-supply-card";
import playCardAction from "../actions/play-card";
import { ActionCard, TreasureCard } from "../cards/types";
import { Colony, Province } from "../cards/victory";
import { Action, Middleware } from "../types";

const phase: Middleware = store => next => async (action: Action) => {
	const getState = () => {
		const state = store.getState()
		const player = state.players.get(state.turn.player)
		return { ...state, player }
	}

	switch(action.type) {
		case 'phase':
			// run the action so reducer changes phase
			const val = next(action);

			switch(action.phase) {
				case 'action': {
					// TODO i don't like these for loops
					for(let { turn } = getState(); turn.actions > 0; { turn } = getState()) {
						const [card] = await store.dispatch(askForCardAction('hand', ActionCard, turn.player))

						if(card) {
							await store.dispatch(playCardAction(card, turn.player))
						} else {
							break
						}
					}

					store.dispatch(phaseAction('buy'))
					break;
				}
				case 'buy': {
					while(true) {
						const { turn } = getState()
						const [card] = await store.dispatch(askForCardAction('hand', TreasureCard, turn.player))

						if(card) {
							await store.dispatch(playCardAction(card, turn.player))
						} else {
							break
						}
					}

					for(let { turn, supply } = getState(); turn.buys > 0; { turn, supply } = getState()) {
						const cardType = await store.dispatch(askForSupplyCardAction(turn.coins))

						if(supply.has(cardType)) {
							if(cardType.cost(turn) <= turn.coins) {
								store.dispatch(buyAction(cardType, turn.player))
							}
						} else {
							break
						}
					}

					store.dispatch(phaseAction('cleanup'))

					break;
				}
				case 'cleanup': {
					for(let { player, turn } = getState(); player.inPlay.size; { player } = getState()) {
						store.dispatch(moveCardAction({
							card: player.inPlay.first(),
							from: 'inPlay',
							to: 'discard',
							player: turn.player
						}))
					}

					for(let { player, turn } = getState(); player.hand.size; { player } = getState()) {
						store.dispatch(moveCardAction({
							card: player.hand.first(),
							from: 'hand',
							to: 'discard',
							player: turn.player
						}))
					}

					store.dispatch(drawAction(5, getState().turn.player))

					const { supply } = store.getState()
					if(
						supply.has(Province) && supply.get(Province).length === 0
						|| supply.has(Colony) && supply.get(Colony).length === 0
						|| supply.filter(pile => pile.length === 0).size === 3
					) {
						// TODO action for this
						throw new Error('game ended lol')
					}

					// TODO move to next player
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
