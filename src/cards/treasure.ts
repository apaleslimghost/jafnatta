
import {CoinValuedCard} from './types';
import {Dispatch, GetState, State} from '../types';
import { addCoinAction } from '../actions';

export default class TreasureCard extends CoinValuedCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;

	getCoinValue(state: State) {
		return -Infinity;
	}

	onPlay(dispatch: Dispatch, getState: GetState) {
		dispatch(addCoinAction(this.getCoinValue(getState())));
	}
}

export class Silver extends TreasureCard {
	static cardName = 'Silver';
	static cost = () => 3;

	getCoinValue() {
		return 2;
	}
}

export class Copper extends TreasureCard {
	static cardName = 'Copper';
	static cost = () => 0;
	static numberInSupply = () => 60

	getCoinValue() {
		return 1;
	}
}
