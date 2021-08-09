
import {PlayableCard} from './types';
import {Dispatch, GetState} from '../types';
import { addActionAction, drawAction } from '../actions';

export default class ActionCard extends PlayableCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;
	onPlay(dispatch: Dispatch, getState: GetState) {
		throw new Error('unimplemented');
	}
}

export class Village extends ActionCard {
	static cardName = 'Village'
	static cost = () => 3

	onPlay(dispatch: Dispatch) {
		dispatch(addActionAction(2))
		dispatch(drawAction(1))
	}
}
