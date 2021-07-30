
import {State, TurnState, Dispatch, GetState} from '../types';
import * as util from 'util'

export class Card {
	static cardName: string
	static text: string
	static cost(_: TurnState): number { return 0 }
	constructor() {}

	static toString() {
		return this.cardName
	}

	[util.inspect.custom]() {
		return (this.constructor as typeof Card).cardName
	}
}

export class PlayableCard extends Card {
	onPlay(_: Dispatch, __: GetState): void | Promise<void> {}
}

export class CoinValuedCard extends PlayableCard {
	getCoinValue(_: State): number { return 0 }
}

export class VictoryValuedCard extends Card {
	getVictoryValue(_: State): number { return 0 }
}
