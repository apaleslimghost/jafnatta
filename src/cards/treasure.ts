
import { Card, TreasureCard, type } from './types';
import {Dispatch, GetState, State} from '../types';
import { addCoinAction } from '../actions';

@type(TreasureCard)
class BasicTreasureCard extends Card {
	static coinValue: number
	static get text() {
		return `$${this.coinValue}`
	}

	onPlay(dispatch: Dispatch, state: State, player: string) {
		dispatch(addCoinAction(
			(this.constructor as typeof BasicTreasureCard).coinValue,
			player
		));
	}

}

export class Platinum extends BasicTreasureCard {
	static cost = () => 9
	static coinValue = 5
}

export class Gold extends BasicTreasureCard {
	static cost = () => 6
	static coinValue = 3
}

export class Silver extends BasicTreasureCard {
	static cost = () => 3
	static coinValue = 2;
}

export class Copper extends BasicTreasureCard {
	static cost = () => 0
	static numberInSupply = () => 60
	static coinValue = 1
}
