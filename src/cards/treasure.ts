
import { Card, TreasureCard, type } from './types';
import {Dispatch, GetState, State} from '../types';
import { addCoinAction } from '../actions';

@type(TreasureCard)
class BasicTreasureCard extends Card {
	onPlay(dispatch: Dispatch, getState: GetState) {
		dispatch(addCoinAction(this.getCoinValue(getState())));
	}

	getCoinValue(state: State) {
		return NaN
	}
}

export class Gold extends BasicTreasureCard {
	static cost = () => 6;

	getCoinValue() {
		return 3;
	}
}

export class Silver extends BasicTreasureCard {
	static cost = () => 3;

	getCoinValue() {
		return 2;
	}
}

export class Copper extends BasicTreasureCard {
	static cost = () => 0;
	static numberInSupply = () => 60

	getCoinValue() {
		return 1;
	}
}
