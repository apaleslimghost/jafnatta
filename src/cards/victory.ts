
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

export class Estate extends VictoryCard {
	static cardName = 'Estate';
	static cost = () => 2;

	getVictoryValue() {
		return 2;
	}
}

export class Duchy extends VictoryCard {
	static cardName = 'Estate';
	static cost = () => 5;

	getVictoryValue() {
		return 3;
	}
}

export class Province extends VictoryCard {
	static cardName = 'Estate';
	static cost = () => 8;

	getVictoryValue() {
		return 5;
	}
}

export class Colony extends VictoryCard {
	static cardName = 'Estate';
	static cost = () => 11;

	getVictoryValue() {
		return 8;
	}
}
