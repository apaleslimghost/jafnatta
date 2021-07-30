import { defaultSupply } from "../state";
import { Action, Supply } from "../types";

const repeat = <T>(length: number, f: () => T): Array<T> => Array.from({ length }, f);

export default function supply(state: Supply = defaultSupply, action: Action): Supply {
	switch (action.type) {
		case 'init-supply':
			return action.cards.reduce(
				(supply, card) => supply.set(card, repeat(10, () => new card())),
				state
			);
		default:
			return state;
	}
}
