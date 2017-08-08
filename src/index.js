// @flow

import {createStore, combineReducers, applyMiddleware} from 'redux';

type TurnState = {
	+actions: number,
	+buys: number,
	+coins: number,
	+phase: Phase,
};

type State = {
	+turn: TurnState,
};

interface Card {
	name: string;
	text: string;
	cost: number;
}

interface PlayableCard extends Card {
	onPlay(Dispatch, GetState): void
}

interface IActionCard extends PlayableCard {}

class ActionCard implements IActionCard {
	name = '';
	text = '';
	cost = Infinity;
	onPlay(dispatch, getState) {
		throw new Error('unimplemented');
	}
}

type PlayCardAction = {type: 'play-card', card: PlayableCard};
type AddActionAction = {type: 'add-action', amount: number};
type AddBuyAction = {type: 'add-buy', amount: number};
type AddCoinAction = {type: 'add-coin', amount: number};
type PhaseAction = {type: 'phase', phase: Phase};

type Action =
	| PlayCardAction
	| AddActionAction
	| AddBuyAction
	| AddCoinAction
	| PhaseAction;

type GetState = () => State;
type Dispatch = (action: Action) => any;

export class Woodcutter extends ActionCard {
	name = 'Woodcutter';
	text = `
		+1 Buy
		+$2
	`;
	cost = 3;

	onPlay(dispatch: Dispatch) {
		dispatch({type: 'add-buy', amount: 1});
		dispatch({type: 'add-coin', amount: 2});
	}
}

const defaultTurnState: TurnState = {
	actions: 1,
	buys: 1,
	coins: 0,
	phase: 'action',
};

function action(state: TurnState = defaultTurnState, action: Action): TurnState {
	switch(action.type) {
		case 'play-card':
			return {...state, actions: state.actions - 1};
		case 'add-action':
			return {...state, actions: state.actions + action.amount};
		case 'add-buy':
			return {...state, buys: state.buys + action.amount};
		case 'add-coin':
			return {...state, coins: state.coins + action.amount};
		case 'phase':
			return {...state, phase: action.phase};
		default: (action: empty)
			return state;
	}
}

const buy = (state, action) => state;
const cleanup = (state, action) => state;

const phases = {action, buy, cleanup};
type Phase = $Keys<typeof phases>;

const allowedCards: {[Phase]: Array<Class<Card>>} = {
	action: [ActionCard],
	buy: [],
	cleanup: [],
};

const turn = (state: TurnState = defaultTurnState, action: Action): TurnState =>
	phases[state.phase](state, action);

const dispatchCardPlay = store => next => action => {
	console.log(action);

	switch(action.type) {
		case 'play-card':
			const {phase} = store.getState().turn;
			const cardAllowed = allowedCards[phase].some(type => action.card instanceof type);
			if(cardAllowed) {
				action.card.onPlay(a => store.dispatch(a));
				return next(action);
			}
		default:
			return next(action);
	}
};

export default createStore(
	combineReducers({turn}),
	applyMiddleware(dispatchCardPlay)
);
