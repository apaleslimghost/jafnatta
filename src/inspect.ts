
import {List} from 'immutable';
import {PlayerState, Supply, State} from './types';
import {Card} from './cards/types';

const inspectTurn = JSON.stringify;

const inspectPlayer = (player: PlayerState): string =>
	'{' +
	Object.keys(player)
		.map((k: keyof PlayerState) => `${k}: ${inspectCardArray(player[k])}`)
		.join(', ') +
	'}';

const inspectCardArray = (cards: Array<Card>): string =>
	'[' + cards.map(card => (card.constructor as typeof Card).cardName).join(', ') + ']';

const inspectSupply = (supply: Supply): string =>
	'{' +
	List(supply)
		.map(
			([card, cards]: [typeof Card, Array<Card>]) =>
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