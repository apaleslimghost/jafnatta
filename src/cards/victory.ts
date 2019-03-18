
import {VictoryValuedCard} from './types';
import {State} from '../types';

export default class VictoryCard extends VictoryValuedCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;

	getVictoryValue(state: State) {
		return -Infinity;
	}
}