// @flow

import {createStore, combineReducers, applyMiddleware} from 'redux';

const composeReducers = (...reducers) =>
	(state, action) =>
		reducers.reduce(
			(state, reducer) => reducer(state, action),
			state
		);

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

class ActionCard implements PlayableCard {
	name = '';
	text = '';
	cost = Infinity;
	onPlay(dispatch, getState) {
		throw new Error('unimplemented');
	}
}

interface ITreasureCard extends PlayableCard {
	getValue(State): number;
}

class TreasureCard implements ITreasureCard {
	name = '';
	text = '';
	cost = Infinity;

	getValue(state) {
		return -Infinity;
	}

	onPlay(dispatch, getState) {
		dispatch({type: 'add-coin', amount: this.getValue(getState())});
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

export class Silver extends TreasureCard {
	name = 'Silver';
	cost = 3;

	getValue() {
		return 2;
	}
}

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

function commonTurnReduce(state: TurnState = defaultTurnState, action: Action): TurnState {
	switch(action.type) {
		case 'add-coin':
			return {...state, coins: state.coins + action.amount};
		default:
			return state;
	}
}

function action(state: TurnState = defaultTurnState, action: Action): TurnState {
	switch(action.type) {
		case 'play-card':
			return {...state, actions: state.actions - 1};
		case 'add-action':
			return {...state, actions: state.actions + action.amount};
		case 'add-buy':
			return {...state, buys: state.buys + action.amount};
		case 'phase':
			return {...state, phase: action.phase};
		default:
			return state;
	}
}

const buy = (state, action) => state;
const cleanup = (state, action) => state;

const phases = {action, buy, cleanup};
type Phase = $Keys<typeof phases>;

const allowedCards: {[Phase]: Array<Class<Card>>} = {
	action: [ActionCard],
	buy: [TreasureCard],
	cleanup: [],
};

const phaseReduce = (state: TurnState = defaultTurnState, action: Action): TurnState =>
	phases[state.phase](state, action);

const turn = composeReducers(commonTurnReduce, phaseReduce);

const dispatchCardPlay = store => next => action => {
	console.log(action);

	switch(action.type) {
		case 'play-card':
			const {phase} = store.getState().turn;
			const cardAllowed = allowedCards[phase].some(type => action.card instanceof type);
			if(cardAllowed) {
				action.card.onPlay(
					store.dispatch.bind(store),
					store.getState.bind(store)
				);
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
