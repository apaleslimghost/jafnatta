
import {State, Supply, TurnState, PlayerState} from './types'
import { Map, List, OrderedSet, Set, OrderedMap } from 'immutable';

export const defaultTurnState: TurnState = {
	actions: 1,
	buys: 1,
	coins: 0,
	phase: null,
	player: null
};

export const defaultPlayerState: PlayerState = {
	hand: OrderedSet(),
	deck: OrderedSet(),
	discard: OrderedSet(),
	inPlay: OrderedSet(),
};

export const defaultSupply: Supply = Map();

export const defaultState: State = {
	turn: defaultTurnState,
	players: OrderedMap(),
	supply: defaultSupply,
	trash: Set()
};
