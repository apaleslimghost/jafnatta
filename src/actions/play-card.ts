
import { addActionAction, moveCardAction } from '..';
import ActionCard from '../cards/action';
import TreasureCard from '../cards/treasure';
import {Card, PlayableCard} from '../cards/types';
import {GetState, Phase, PlayCardAction, ThunkDispatch, ThunkResult} from '../types';

const allowedCards: { [phase in Phase]: Array<typeof Card> } = {
	action: [ActionCard],
	buy: [TreasureCard],
	cleanup: [],
};

const makeTheCardDoAThing = (card: PlayableCard): ThunkResult<void | Promise<void>> => (
	dispatch: ThunkDispatch,
	getState: GetState
) => card.onPlay(dispatch, getState);

const playCardAction = (
	card: PlayableCard,
	{ fromCard = false } = {}
): ThunkResult<Promise<PlayCardAction>> => async (
	dispatch: ThunkDispatch,
	getState
) => {
	const {phase} = getState().turn
	const cardAllowed = allowedCards[phase].some(
		type => card instanceof type
	);

	if (cardAllowed) {
		if(!fromCard && card instanceof ActionCard) {
			dispatch(addActionAction(-1))
		}

		await dispatch(moveCardAction({ card, from: 'hand', to: 'inPlay' }))
		await dispatch(makeTheCardDoAThing(card));
	}

	return dispatch({ type: 'play-card', card });
}

export default playCardAction;
