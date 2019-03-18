
import {CoinValuedCard} from './types';
import {Dispatch, GetState, State} from '../types';
import {addCoinAction} from '../';

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