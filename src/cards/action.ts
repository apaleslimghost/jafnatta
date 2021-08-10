
import { Card, PlayableCard } from './types';
import { GetState, ThunkDispatch } from '../types';
import { askForCardAction } from '../actions/ask-for-card';
import { trashAction, addActionAction, drawAction } from '../actions';
import { ThunkAction } from 'redux-thunk';

export default class ActionCard extends PlayableCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;
	onPlay(dispatch: ThunkDispatch, getState: GetState) {
		throw new Error('unimplemented');
	}
}

export class Village extends ActionCard {
	static cost = () => 3

	onPlay(dispatch: ThunkDispatch) {
		dispatch(addActionAction(2))
		dispatch(drawAction(1))
	}
}

export class Chapel extends ActionCard {
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
