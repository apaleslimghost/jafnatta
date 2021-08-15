
import { Card, type, VictoryCard } from './types';
import {State} from '../types';

@type(VictoryCard)
export default class BasicVictoryCard extends Card {
	getVictoryValue(state: State) {
		return -Infinity;
	}
}

export class Estate extends BasicVictoryCard {
	static displayName = 'Estate';
	static cost = () => 2;

	getVictoryValue() {
		return 2;
	}
}

export class Duchy extends BasicVictoryCard {
	static displayName = 'Duchy';
	static cost = () => 5;

	getVictoryValue() {
		return 3;
	}
}

export class Province extends BasicVictoryCard {
	static displayName = 'Province';
	static cost = () => 8;

	getVictoryValue() {
		return 5;
	}
}

export class Colony extends BasicVictoryCard {
	static displayName = 'Colony';
	static cost = () => 11;

	getVictoryValue() {
		return 8;
	}
}
