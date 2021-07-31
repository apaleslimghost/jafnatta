import { defaultState, defaultSupply } from "../state";
import { Action, State, Supply } from "../types";

const repeat = <T>(length: number, f: () => T): Array<T> => Array.from({ length }, f);

export default function supply(state: State, action: Action): Supply {
	state.supply ||= defaultSupply

	switch (action.type) {
		case 'init-supply':
			return action.cards.reduce(
				(supply, card) => supply.set(card, repeat(card.numberInSupply(state), () => new card())),
				state.supply
			);
		default:
			return state.supply;
	}
}
