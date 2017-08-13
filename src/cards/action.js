//@flow

import type {PlayableCard} from './types';
import type {Dispatch, GetState} from '../types';

export default class ActionCard implements PlayableCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;
	onPlay(dispatch: Dispatch, getState: GetState) {
		throw new Error('unimplemented');
	}
}