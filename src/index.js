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
	onPlay(Dispatch): void
}

interface ActionCard extends PlayableCard {}

type PlayCardAction = {type: 'play-card', card: PlayableCard};
type AddActionAction = {type: 'add-action', amount: number};
type AddBuyAction = {type: 'add-buy', amount: number};
type AddCoinAction = {type: 'add-coin', amount: number};

type Action =
	| PlayCardAction
	| AddActionAction
	| AddBuyAction
	| AddCoinAction;

type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

export class Woodcutter implements ActionCard {
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
			return state;
		case 'add-action':
			return {...state, actions: state.actions + action.amount};
		case 'add-buy':
			return {...state, buys: state.buys + action.amount};
		case 'add-coin':
			return {...state, coins: state.coins + action.amount};
		default: (action: empty)
			return state;
	}
}

const buy = (state, action) => state;
const cleanup = (state, action) => state;

const phases = {action, buy, cleanup};

type Phase = $Keys<typeof phases>;

const turn = (state: TurnState = defaultTurnState, action: Action): TurnState =>
	phases[state.phase](state, action);

const dispatchCardPlay = store => next => action => {
	console.log(action);
	switch(action.type) {
		case 'play-card':
			const {card} = action;
			card.onPlay(a => store.dispatch(a));
			return next(action);
		default:
			return next(action);
	}
};

export default createStore(
	combineReducers({turn}),
	applyMiddleware(dispatchCardPlay)
);
