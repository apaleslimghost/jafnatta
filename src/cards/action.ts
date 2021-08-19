
import { Card, ActionCard, type } from './types';
import { GetState, State, ThunkDispatch } from '../types';
import { askForCardAction } from '../actions/ask-for-card';
import { trashAction, addActionAction, drawAction, moveCardAction } from '../actions';
import { ThunkAction } from 'redux-thunk';

@type(ActionCard)
export class Village extends Card {
	static cost = () => 3

	onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		dispatch(addActionAction(2, player))
		dispatch(drawAction(1, player))
	}
}

@type(ActionCard)
export class Chapel extends Card {
	static cost = () => 2

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const cards = await dispatch(askForCardAction(
			'hand',
			Card,
			player,
			4
		))

		for(const card of cards) {
			dispatch(trashAction(card, 'hand', player))
		}
	}
}

@type(ActionCard)
export class Cellar extends Card {
	static cost = () => 2

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const cards = await dispatch(askForCardAction(
			'hand',
			Card,
			player,
			Infinity
		))

		for(const card of cards) {
			dispatch(moveCardAction({ card, from: 'hand', to: 'discard', player }))
		}

		dispatch(drawAction(cards.length, player))
	}
}
