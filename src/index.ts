
//TODO drawing & shuffling
//TODO players

import { createStore, combineReducers, applyMiddleware, Middleware as BaseMiddleware, Store } from 'redux';
import { Reducer, AnyAction, Dispatch } from 'redux'
import { Map, List } from 'immutable';
import thunk, {ThunkAction, ThunkDispatch as BaseThunkDispatch} from 'redux-thunk';
import shuffle from 'array-shuffle'
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
	ActionType,
	ActionArgs,
	DrawAction,
	ShuffleAction,
	MoveCardAction,
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
import { inspectAction } from './inspect';
import { stat } from 'fs';

import { createDynamicMiddlewares } from 'redux-dynamic-middlewares'
import { AssertionError } from 'assert';

const dynamicMiddlewaresInstance = createDynamicMiddlewares<Middleware>()

type ThunkResult<R> = ThunkAction<R, State, undefined, Action>;
type ThunkDispatch = BaseThunkDispatch<State, undefined, Action>;
type Middleware = BaseMiddleware<{}, State, ThunkDispatch>;

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

export const gainAction = ({card, where = 'discard'}: ActionArgs<GainAction>): GainAction => ({
	type: 'gain-card',
	card,
	where
});

export const buyAction = (card: typeof Card): BuyAction => ({
	type: 'buy-card',
	card,
});

export const drawAction = (amount: number): DrawAction => ({
	type: 'draw',
	amount
})

export const initPlayerAction = (): InitPlayerAction => ({
	type: 'init-player',
});

export const initSupplyAction = (
	cards: Array<typeof Card>
): InitSupplyAction => ({ type: 'init-supply', cards });

type ActionFromType<T extends ActionType> = Extract<Action, {type: T}>

export const waitForActionAction = <T extends ActionType>(action: T): ThunkResult<Promise<ActionFromType<T>>> => (
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
): ThunkResult<Promise<ChooseCardAction>> => async (dispatch: ThunkDispatch, getState) => {
	dispatch({ type: 'ask-for-card', from, cardType });
	return dispatch(waitForActionAction('choose-card'));
};

export const chooseCardAction = (card: Card): ChooseCardAction => ({
	type: 'choose-card',
	card,
});

export const moveCardAction = ({card, from, to}: ActionArgs<MoveCardAction>): MoveCardAction => ({
	type: 'move-card',
	card, from, to
})

export const shuffleAction = (): ShuffleAction => ({type: 'shuffle'})

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
			askForCardAction('hand', ActionCard)
		);

		if(!(card instanceof ActionCard)) throw new AssertionError({
			message: 'Should have returned an ActionCard',
			expected: ActionCard,
			actual: card.constructor
		})

		dispatch(playCardAction(card));
		dispatch(playCardAction(card));
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
	console.log(inspectAction(action));
	next(action);
};

const makeTheCardDoAThing = (card: PlayableCard): ThunkResult<void | Promise<void>> => (
	dispatch: ThunkDispatch,
	getState: GetState
) => card.onPlay(dispatch, getState);

const playCard: Middleware = ({dispatch}: {dispatch: ThunkDispatch}) => next => async action => {
	switch (action.type) {
		case 'play-card':
			const { phase }: { phase: Phase } = store.getState().turn;
			const cardAllowed = allowedCards[phase].some(
				type => action.card instanceof type
			);

			if (cardAllowed) {
				await dispatch(moveCardAction({ card: action.card, from: 'hand', to: 'inPlay' }))
				await dispatch(makeTheCardDoAThing(action.card));
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

const initPlayer: Middleware = store => next => action => {
	switch(action.type) {
		case 'init-player':
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Copper }))
			store.dispatch(gainAction({ card: Estate }))
			store.dispatch(gainAction({ card: Estate }))
			store.dispatch(gainAction({ card: Estate }))
			store.dispatch(drawAction(5))
			break;
		default:
			return next(action);
	}
}

const draw: Middleware = store => next => action => {
	switch (action.type) {
		case 'draw':
			for(let i = 0; i < action.amount; i++) {
				if(store.getState().player.deck.length === 0) {
					store.dispatch(shuffleAction())
				}

				store.dispatch(moveCardAction({
					card: store.getState().player.deck[0],
					from: 'deck',
					to: 'hand'
				}))

			}
		default:
			next(action);
	}
}

function gainCardReducer(state: State = defaultState, action: Action): State {
	switch (action.type) {
		case 'gain-card':
			const [card, ...remaining] = state.supply.get(action.card);
			return {
				...state,
				player: {
					...state.player,
					[action.where]: state.player[action.where].concat([card]),
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
		case 'shuffle':
			return {
				...state,
				deck: shuffle(state.discard),
				discard: []
			}
		case 'move-card':
			return {
				...state,
				[action.from]: state[action.from].filter(c => c !== action.card),
				[action.to]: state[action.to].concat([action.card])
			}
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

const store: Store<State, Action> & {dispatch: ThunkDispatch} = createStore(
	reducer,
	applyMiddleware(
		thunk,
		logActions,
		dynamicMiddlewaresInstance.enhancer,
		playCard,
		buyCard,
		initPlayer,
		draw,
	)
);

export const addInterface = (middleware: Middleware) => dynamicMiddlewaresInstance.addMiddleware(middleware)

export default store
