
import {PlayableCard} from '../cards/types';
import {PlayCardAction} from '../types';

const playCardAction = (card: PlayableCard): PlayCardAction => ({
	type: 'play-card',
	card,
});

export default playCardAction;
