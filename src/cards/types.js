//@flow

import type {State, Dispatch, GetState} from '../types';

export interface Card {
	static cardName: string,
	static text: string,
	static cost(State): number,
	constructor(): Card,
}

export interface PlayableCard extends Card {
	onPlay(Dispatch, GetState): void | Promise<void>,
}

export interface CoinValuedCard extends PlayableCard {
	getCoinValue(State): number,
}

export interface VictoryValuedCard extends Card {
	getVictoryValue(State): number,
}