//@flow

import type {PlayableCard} from '../cards/types';
import type {PlayCardAction} from '../types';

const playCardAction = (card: PlayableCard): PlayCardAction => ({
	type: 'play-card',
	card,
});

export default playCardAction;
