//@flow

import {List} from 'immutable';
import type {PlayerState, Supply, State} from './types';
import type {Card} from './cards/types';

const inspectTurn = JSON.stringify;

const inspectPlayer = (player: PlayerState): string =>
	'{' +
	Object.keys(player)
		.map(k => `${k}: ${inspectCardArray(player[k])}`)
		.join(', ') +
	'}';

const inspectCardArray = (cards: Array<Card>): string =>
	'[' + cards.map(card => card.constructor.cardName).join(', ') + ']';

const inspectSupply = (supply: Supply): string =>
	'{' +
	List(supply)
		.map(
			([card: Class<Card>, cards: Array<Card>]) =>
				`${card.cardName}: ${cards.length}`
		)
		.join(', ') +
	'}';

const inspectState = (state: State): string => `State {
	Turn: ${inspectTurn(state.turn)},
	Player: ${inspectPlayer(state.player)},
	Supply: ${inspectSupply(state.supply)},
	Wait: ${JSON.stringify(state.wait)},
}`

export default inspectState;