// @flow

//TODO drawing & shuffling
//TODO players

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Map, List } from 'immutable';
import thunk from 'redux-thunk';
import type {
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
} from './types';

const composeReducers = (...reducers) => (state, action) =>
	reducers.reduce((state, reducer) => reducer(state, action), state);

interface Card {
	static cardName: string,
	static text: string,
	static cost(State): number,
	constructor(): Card,
}

interface PlayableCard extends Card {
	onPlay(Dispatch, GetState): void | Promise<void>,
}

export class ActionCard implements PlayableCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;
	onPlay(dispatch: Dispatch, getState: GetState) {
		throw new Error('unimplemented');
	}
}

interface CoinValuedCard extends PlayableCard {
	getCoinValue(State): number,
}

interface VictoryValuedCard extends Card {
	getVictoryValue(State): number,
}

class VictoryCard implements VictoryValuedCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;

	getVictoryValue(state) {
		return -Infinity;
	}
}

class TreasureCard implements CoinValuedCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;

	getCoinValue(state) {
		return -Infinity;
	}

	onPlay(dispatch, getState) {
		dispatch(addCoinAction(this.getCoinValue(getState())));
	}
}

type Resolve<T> = (T | Promise<T>) => void;
type Reject = Error => void;

class ExternalPromise<T> extends Promise<T> {
	resolve: Resolve<T>;
	reject: Reject;

	constructor(resolver: (Resolve<T>, Reject) => void) {
		super(resolver);
	}

	static create<T>(): ExternalPromise<T> {
		let resolve, reject;
		const out = new ExternalPromise((s, j) => {
			resolve = s;
			reject = j;
		});

		return Object.assign(out, { resolve, reject });
	}
}

export const playCardAction = (card: PlayableCard): PlayCardAction => ({
	type: 'play-card',
	card,
});
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
export const gainAction = (card: Class<Card>): GainAction => ({
	type: 'gain-card',
	card,
});
export const buyAction = (card: Class<Card>): BuyAction => ({
	type: 'buy-card',
	card,
});
export const initPlayerAction = (): InitPlayerAction => ({
	type: 'init-player',
});
export const initSupplyAction = (
	cards: Array<Class<Card>>
): InitSupplyAction => ({ type: 'init-supply', cards });
export const waitForActionAction = (action: string): ThunkAction => (
	dispatch,
	getState
) => {
	const promise: ExternalPromise<Action> = ExternalPromise.create();
	dispatch({ type: 'wait-for-action', action, promise });
	return promise;
};

export const askForCardAction = (
	from: $Keys<PlayerState>,
	cardType: Class<Card>
): ThunkAction => (dispatch, getState) => {
	dispatch({ type: 'ask-for-card', from, cardType });
	return dispatch(waitForActionAction('choose-card'));
};

export const chooseCardAction = (card: Card): ChooseCardAction => ({
	type: 'choose-card',
	card,
});

type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (
	action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

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

	onPlay(dispatch: Dispatch) {
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

	async onPlay(dispatch: Dispatch) {
		const { card } = await dispatch(
			waitForActionAction('choose-card-from-hand')
		);
		dispatch(playCardAction(card));
		dispatch(playCardAction(card));
	}
}

const defaultTurnState: TurnState = {
	actions: 1,
	buys: 1,
	coins: 0,
	phase: 'action',
};

const defaultPlayerState: PlayerState = {
	hand: [],
	deck: [],
	discard: [],
	inPlay: [],
};

const defaultSupply = Map();

const defaultState = {
	turn: defaultTurnState,
	player: defaultPlayerState,
	supply: defaultSupply,
	wait: {},
};

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

function action(
	state: TurnState = defaultTurnState,
	action: Action
): TurnState {
	switch (action.type) {
		case 'play-card':
			return { ...state, actions: state.actions - 1 };
		case 'add-action':
			return { ...state, actions: state.actions + action.amount };
		case 'add-buy':
			return { ...state, buys: state.buys + action.amount };
		case 'phase':
			if (action.phase === 'buy') {
				return { ...state, phase: action.phase };
			} else return state;
		default:
			return state;
	}
}

const buy = (state, action) => {
	switch (action.type) {
		case 'phase':
			if (action.phase === 'cleanup') {
				return { ...state, phase: action.phase };
			} else return state;
		case 'buy-card':
			return {
				...state,
				coins: state.coins - action.card.cost(state),
				buys: state.buys - 1,
			};
		default:
			return state;
	}
};

const cleanup = (state, action) => state;

const phases = { action, buy, cleanup };
type Phase = $Keys<typeof phases>;

const allowedCards: { [Phase]: Array<Class<Card>> } = {
	action: [ActionCard],
	buy: [TreasureCard],
	cleanup: [],
};

const phaseReduce = (
	state: TurnState = defaultTurnState,
	action: Action
): TurnState => phases[state.phase](state, action);

const turn = composeReducers(commonTurnReduce, phaseReduce);

const logActions = store => next => action => {
	console.log(action);
	next(action);
};

const makeTheCardDoAThing = (card: PlayableCard): ThunkAction => (
	dispatch: Dispatch,
	getState: GetState
) => card.onPlay(dispatch, getState);

const playCard = store => next => action => {
	switch (action.type) {
		case 'play-card':
			const card: Card = action.card; //WAT
			const { phase } = store.getState().turn;
			const cardAllowed = allowedCards[phase].some(
				type => card instanceof type
			);
			if (cardAllowed) {
				store.dispatch(makeTheCardDoAThing(action.card));

				return next(action);
			}
		default:
			return next(action);
	}
};

const buyCard = store => next => action => {
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

const repeat = (length, f) => Array.from({ length }, f);

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

export default createStore(
	composeReducers(
		combineReducers({ turn, supply, player, wait }),
		gainCardReducer
	),
	applyMiddleware(thunk, logActions, playCard, buyCard)
);
