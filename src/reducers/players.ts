import { OrderedMap, Range } from "immutable";
import { defaultPlayerState } from "../state";
import { Action, ID, PlayerState } from "../types";
import player from "./player";
import * as UUID from 'uuid'

export default function players(
	players: OrderedMap<ID, PlayerState>,
	action: Action
): OrderedMap<ID, PlayerState> {
	if(action.type === 'create-players') {
		return OrderedMap(Array.from({length: action.number}, () => [
			UUID.v4(),
			defaultPlayerState
		]))
	}

	if('player' in action) {
		return players.update(action.player, state => player(state, action))
	}

	return players
}
