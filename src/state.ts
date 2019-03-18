
import {State, Supply, TurnState, PlayerState} from './types'
import { Map, List } from 'immutable';

export const defaultTurnState: TurnState = {
	actions: 1,
	buys: 1,
	coins: 0,
	phase: 'action',
};

export const defaultPlayerState: PlayerState = {
	hand: [],
	deck: [],
	discard: [],
	inPlay: [],
};

export const defaultSupply: Supply = Map();

export const defaultState: State = {
	turn: defaultTurnState,
	player: defaultPlayerState,
	supply: defaultSupply,
	wait: {},
};