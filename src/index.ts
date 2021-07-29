
//TODO drawing & shuffling
//TODO players

import { createStore, combineReducers, applyMiddleware, Middleware, Store } from 'redux';
import { Reducer, AnyAction, Dispatch } from 'redux'
import { Map, List } from 'immutable';
import thunk, {ThunkAction, ThunkDispatch as BaseThunkDispatch} from 'redux-thunk';
import {
	Action,
	PlayCardAction,
	AddActionAction,
	AddBuyAction,
	PhaseAction,
	AddCoinAction,
	GainAction,
	BuyAction,
	InitPlayerAction,
	InitSupplyAction,
	ChooseCardAction,
	WaitState,
	PlayerState,
	Supply,
	TurnState,
	State,
	GetState,
	Phase,
	ChooseCardFromHandAction,
	ActionType,
} from './types';
import ExternalPromise from './external-promise';
import ActionCard from './cards/action'
import TreasureCard from './cards/treasure'
import VictoryCard from './cards/victory'
import playCardAction from './actions/play-card'
import phases from './reducers/phases';
import {defaultPlayerState, defaultState, defaultTurnState, defaultSupply} from './state'

import {PlayableCard, VictoryValuedCard, CoinValuedCard, Card} from './cards/types';

import * as util from 'util'

type ThunkResult<R> = ThunkAction<R, State, undefined, Action>;
type ThunkDispatch = BaseThunkDispatch<State, undefined, Action>;

export const addActionAction = (amount: number): AddActionAction => ({
	type: 'add-action',
	amount,
});

export const addBuyAction = (amount: number): AddBuyAction => ({
	type: 'add-buy',
	amount,
});

export const addCoinAction = (amount: number): AddCoinAction => ({
	type: 'add-coin',
	amount,
});

export const phaseAction = (phase: Phase): PhaseAction => ({
	type: 'phase',
	phase,
});

export const gainAction = (card: typeof Card): GainAction => ({
	type: 'gain-card',
	card,
});

export const buyAction = (card: typeof Card): BuyAction => ({
	type: 'buy-card',
	card,
});

export const initPlayerAction = (): InitPlayerAction => ({
	type: 'init-player',
});

export const initSupplyAction = (
	cards: Array<typeof Card>
): InitSupplyAction => ({ type: 'init-supply', cards });

type ActionFromType<T extends ActionType> = Extract<Action, {type: T}>

export const waitForActionAction = <T extends ActionType>(action: T): ThunkResult<ExternalPromise<ActionFromType<T>>> => (
	dispatch: ThunkDispatch,
	getState
) => {
	const promise: ExternalPromise<ActionFromType<T>> = ExternalPromise.create();
	dispatch({ type: 'wait-for-action', action, promise });
	return promise;
};

export const askForCardAction = (
	from: keyof PlayerState,
	cardType: typeof Card
): ThunkResult<ExternalPromise<Action>> => (dispatch: ThunkDispatch, getState) => {
	dispatch({ type: 'ask-for-card', from, cardType });
	return dispatch(waitForActionAction('choose-card'));
};

export const chooseCardAction = (card: Card): ChooseCardAction => ({
	type: 'choose-card',
	card,
});

export class Silver extends TreasureCard {
	static cardName = 'Silver';
	static cost = () => 3;

	getCoinValue() {
		return 2;
	}
}

export class Copper extends TreasureCard {
	static cardName = 'Copper';
	static cost = () => 0;

	getCoinValue() {
		return 1;
	}
}

export class Estate extends VictoryCard {
	static cardName = 'Estate';
	static cost = () => 2;

	getVictoryValue() {
		return 2;
	}
}

export class Woodcutter extends ActionCard {
	static cardName = 'Woodcutter';
	static text = `
		+1 Buy
		+$2
	`;
	static cost = () => 3;

	onPlay(dispatch: ThunkDispatch) {
		dispatch(addBuyAction(1));
		dispatch(addCoinAction(2));
	}
}

export class ThroneRoom extends ActionCard {
	static cardName = 'Throne Room';
	static text = `
		You may play an Action card from your hand twice.
	`;
	static cost = () => 4;

	async onPlay(dispatch: ThunkDispatch) {
		const { card } = await dispatch(
			waitForActionAction('choose-card-from-hand')
		);

		if(card instanceof PlayableCard) { // TODO choose only playable
			dispatch(playCardAction(card));
			dispatch(playCardAction(card));
		}
	}
}

function commonTurnReduce(
	state: TurnState = defaultTurnState,
	action: Action
): TurnState {
	switch (action.type) {
		case 'add-coin':
			return { ...state, coins: state.coins + action.amount };
		default:
			return state;
	}
}

const allowedCards: { [phase in Phase]: Array<typeof Card> } = {
	action: [ActionCard],
	buy: [TreasureCard],
	cleanup: [],
};

const phaseReduce = (
	state: TurnState = defaultTurnState,
	action: Action
): TurnState => phases[state.phase](state, action);

const turn = (state: TurnState, action: Action) => commonTurnReduce(phaseReduce(state, action), action);

const logActions: Middleware = store => next => action => {
	console.log('Action ' + util.inspect(action) + '\n');
	next(action);
};

const makeTheCardDoAThing = (card: PlayableCard): ThunkResult<void | Promise<void>> => (
	dispatch: ThunkDispatch,
	getState: GetState
) => card.onPlay(dispatch, getState);

const playCard: Middleware = ({dispatch}: {dispatch: ThunkDispatch}) => next => action => {
	switch (action.type) {
		case 'play-card':
			const { phase }: { phase: Phase } = store.getState().turn;
			const cardAllowed = allowedCards[phase].some(
				type => action.card instanceof type
			);

			if (cardAllowed) {
				dispatch(makeTheCardDoAThing(action.card));
				return next(action);
			}
		default:
			return next(action);
	}
};

const buyCard: Middleware = store => next => action => {
	switch (action.type) {
		case 'buy-card':
			const { phase, buys } = store.getState().turn;
			if (phase === 'buy' && buys >= 1) {
				const val = next(action);
				store.dispatch(gainAction(action.card));
				return val;
			}
			break;
		default:
			return next(action);
	}
};

function gainCardReducer(state: State = defaultState, action: Action): State {
	switch (action.type) {
		case 'gain-card':
			const [card, ...remaining] = state.supply.get(action.card);
			return {
				...state,
				player: {
					...state.player,
					discard: state.player.discard.concat([card]),
				},
				supply: state.supply.set(action.card, remaining),
			};
		default:
			return state;
	}
}

const repeat = <T>(length: number, f: () => T): Array<T> => Array.from({ length }, f);

function supply(state: Supply = defaultSupply, action: Action): Supply {
	switch (action.type) {
		case 'init-supply':
			return action.cards.reduce(
				(supply, card) => supply.set(card, repeat(10, () => new card())),
				state
			);
		default:
			return state;
	}
}

function player(
	state: PlayerState = defaultPlayerState,
	action: Action
): PlayerState {
	switch (action.type) {
		case 'init-player':
			return {
				...state,
				deck: [
					new Copper(),
					new Copper(),
					new Copper(),
					new Copper(),
					new Copper(),
					new Copper(),
					new Copper(),
					new Estate(),
					new Estate(),
					new Estate(),
				],
			};
		default:
			return state;
	}
}

function wait(state: WaitState = {}, action: Action): WaitState {
	switch (action.type) {
		case 'wait-for-action':
			return {
				...state,
				action: action.action,
				promise: action.promise,
			};
		case state.action:
			if (state.promise) {
				state.promise.resolve(action);
			}

			return {};
		default:
			return state;
	}
}

const sliceReducers = combineReducers({ turn, supply, player, wait })

const reducer: Reducer = (state, action) => gainCardReducer(sliceReducers(state, action), action)

const store: Store & {dispatch: ThunkDispatch} = createStore(
	reducer,
	applyMiddleware(thunk, logActions, playCard, buyCard)
);

export default store
