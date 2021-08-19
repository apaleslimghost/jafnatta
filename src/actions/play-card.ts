
import { addActionAction, moveCardAction } from '.'
import { Card, ActionCard, TreasureCard, PlayableCard } from '../cards/types'
import {GetState, Phase, PlayCardAction, ThunkDispatch, ThunkResult} from '../types'

const allowedCards: { [phase in Phase]: Array<typeof Card> } = {
	action: [ActionCard],
	buy: [TreasureCard],
	cleanup: [],
};

const makeTheCardDoAThing = (card: ActionCard, player: string): ThunkResult<void | Promise<void>> => (
	dispatch: ThunkDispatch,
	getState: GetState
) => card.onPlay(dispatch, getState(), player);

const playCardAction = (
	card: Card & PlayableCard,
	player: string,
	{ fromCard = false } = {}
): ThunkResult<Promise<PlayCardAction>> => async (
	dispatch: ThunkDispatch,
	getState
) => {
	const {phase} = getState().turn
	const cardAllowed = allowedCards[phase].some(
		type => card.is(type)
	);

	if (cardAllowed) {
		if(!fromCard && card.is(ActionCard)) {
			dispatch(addActionAction(-1, player))
		}

		await dispatch(moveCardAction({ card, from: 'hand', to: 'inPlay', player }))
		await dispatch(makeTheCardDoAThing(card, player));
	}

	return dispatch({ type: 'play-card', card });
}

export default playCardAction;
