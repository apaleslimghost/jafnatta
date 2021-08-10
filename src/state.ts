
import {State, Supply, TurnState, PlayerState} from './types'
import { Map, List, OrderedSet, Set } from 'immutable';

export const defaultTurnState: TurnState = {
	actions: 1,
	buys: 1,
	coins: 0,
	phase: 'action',
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
	player: defaultPlayerState,
	supply: defaultSupply,
	trash: Set()
};
