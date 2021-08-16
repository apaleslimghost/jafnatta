
import { Card, ActionCard, type } from './types';
import { GetState, ThunkDispatch } from '../types';
import { askForCardAction } from '../actions/ask-for-card';
import { trashAction, addActionAction, drawAction, moveCardAction } from '../actions';
import { ThunkAction } from 'redux-thunk';

@type(ActionCard)
export class Village extends Card {
	static cost = () => 3

	onPlay(dispatch: ThunkDispatch) {
		dispatch(addActionAction(2))
		dispatch(drawAction(1))
	}
}

@type(ActionCard)
export class Chapel extends Card {
	static cost = () => 2

	async onPlay(dispatch: ThunkDispatch, getState: GetState) {
		const cards = await dispatch(askForCardAction(
			'hand',
			Card,
			4
		))

		for(const card of cards) {
			dispatch(trashAction(card, 'hand'))
		}
	}
}

@type(ActionCard)
export class Cellar extends Card {
	static cost = () => 2

	async onPlay(dispatch: ThunkDispatch) {
		const cards = await dispatch(askForCardAction(
			'hand',
			Card,
			Infinity
		))

		for(const card of cards) {
			dispatch(moveCardAction({ card, from: 'hand', to: 'discard' }))
		}

		dispatch(drawAction(cards.length))
	}
}
