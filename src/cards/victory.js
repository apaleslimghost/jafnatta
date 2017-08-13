//@flow

import type {VictoryValuedCard} from './types';
import type {State} from '../types';

export default class VictoryCard implements VictoryValuedCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;

	getVictoryValue(state: State) {
		return -Infinity;
	}
}