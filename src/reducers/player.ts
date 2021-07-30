import shuffle from "array-shuffle";
import { OrderedSet } from "immutable";
import { defaultPlayerState } from "../state";
import { Action, PlayerState } from "../types";

export default function player(
	state: PlayerState = defaultPlayerState,
	action: Action
): PlayerState {
	switch (action.type) {
		case 'shuffle':
			return {
				...state,
				deck: OrderedSet(shuffle(state.discard.toArray())),
				discard: OrderedSet()
			}
		case 'move-card':
			return {
				...state,
				[action.from]: state[action.from].delete(action.card),
				[action.to]: state[action.to].add(action.card)
			}
		default:
			return state;
	}
}
