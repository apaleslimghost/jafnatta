// @flow

//TODO drawing & shuffling
//TODO players

import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Map, List} from 'immutable';
import thunk from 'redux-thunk';

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

type Supply = Map<Class<Card>, Array<Card>>;

type PlayerState = {
	+deck: Array<Card>,
	+hand: Array<Card>,
	+discard: Array<Card>,
};

type State = {
	+turn: TurnState,
	+supply: Supply,
	+player: PlayerState,
};

const inspectTurn = JSON.stringify;

const inspectPlayer = (player: PlayerState): string =>
	'{'+ Object.keys(player).map(k => `${k}: ${inspectCardArray(player[k])}`).join(', ') + '}';

const inspectCardArray = (cards: Array<Card>): string =>
	'[' + cards.map(card => card.constructor.cardName).join(', ') + ']';

const inspectSupply = (supply: Supply): string =>
	'{' + List(supply).map(
		([card: Class<Card>, cards: Array<Card>]) => `${card.cardName}: ${cards.length}`
	).join(', ') + '}'

export const inspectState = (state: State): string => `State {
	Turn: ${inspectTurn(state.turn)},
	Player: ${inspectPlayer(state.player)},
	Supply: ${inspectSupply(state.supply)},
}`;

interface Card {
	static cardName: string;
	static text: string;
	static cost(State): number;
	constructor(): Card;
}

interface PlayableCard extends Card {
	onPlay(Dispatch, GetState): void
}

class ActionCard implements PlayableCard {
	static cardName = '';
	static text = '';
	static cost = () => Infinity;
	onPlay(dispatch, getState) {
		throw new Error('unimplemented');
	}
}

interface CoinValuedCard extends PlayableCard {
	getCoinValue(State): number;
}

interface VictoryValuedCard extends Card {
	getVictoryValue(State): number;
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

type PlayCardAction = {type: 'play-card', card: PlayableCard};
type AddActionAction = {type: 'add-action', amount: number};
type AddBuyAction = {type: 'add-buy', amount: number};
type AddCoinAction = {type: 'add-coin', amount: number};
type PhaseAction = {type: 'phase', phase: Phase};
type GainAction = {type: 'gain-card', card: Class<Card>};
type BuyAction = {type: 'buy-card', card: Class<Card>};
type InitPlayerAction = {type: 'init-player'};
type InitSupplyAction = {type: 'init-supply', cards: Array<Class<Card>>};

type Action =
	| PlayCardAction
	| AddActionAction
	| AddBuyAction
	| AddCoinAction
	| PhaseAction
	| GainAction
	| BuyAction
	| InitPlayerAction
	| InitSupplyAction;

export const playCardAction = (card: PlayableCard): PlayCardAction => ({type: 'play-card', card});
export const addActionAction = (amount: number): AddActionAction => ({type: 'add-action', amount});
export const addBuyAction = (amount: number): AddBuyAction => ({type: 'add-buy', amount});
export const addCoinAction = (amount: number): AddCoinAction => ({type: 'add-coin', amount});
export const phaseAction = (phase: Phase): PhaseAction => ({type: 'phase', phase});
export const gainAction = (card: Class<Card>): GainAction => ({type: 'gain-card', card});
export const buyAction = (card: Class<Card>): BuyAction => ({type: 'buy-card', card});
export const initPlayerAction = (): InitPlayerAction => ({type: 'init-player'});
export const initSupplyAction = (cards: Array<Class<Card>>): InitSupplyAction => ({type: 'init-supply', cards});

type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;

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
};

const defaultSupply = Map();

const defaultState = {
	turn: defaultTurnState,
	player: defaultPlayerState,
	supply: defaultSupply,
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
			if(action.phase === 'buy') {
				return {...state, phase: action.phase};
			} else return state;
		default:
			return state;
	}
}

const buy = (state, action) => {
	switch(action.type) {
		case 'phase':
			if(action.phase === 'cleanup') {
				return {...state, phase: action.phase};
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

const logActions = store => next => action => {
	console.log(action);
	next(action);
};

const makeTheCardDoAThing = (card: PlayableCard): ThunkAction => (dispatch: Dispatch, getState: GetState) =>
	card.onPlay(
		dispatch,
		getState
	);


const playCard = store => next => action => {
	switch(action.type) {
		case 'play-card':
			const card: Card = action.card; //WAT
			const {phase} = store.getState().turn;
			const cardAllowed = allowedCards[phase].some(type => card instanceof type);
			if(cardAllowed) {
				store.dispatch(makeTheCardDoAThing(action.card));

				return next(action);
			}
		default:
			return next(action);
	}
};

const buyCard = store => next => action => {
	switch(action.type) {
		case 'buy-card':
			const {phase, buys} = store.getState().turn;
			if(phase === 'buy' && buys >= 1) {
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
	switch(action.type) {
		case 'gain-card':
			const [card, ...remaining] = state.supply.get(action.card);
			return {
				...state,
				player: {
					...state.player,
					discard: state.player.discard.concat([
						card
					]),
				},
				supply: state.supply.set(
					action.card,
					remaining
				),
			};
		default:
			return state;
	}
}

const repeat = (length, f) => Array.from({length}, f);

function supply(state: Supply = defaultSupply, action: Action): Supply {
	switch(action.type) {
		case 'init-supply':
			return action.cards.reduce(
				(supply, card) => supply.set(card, repeat(10, () => new card)),
				state
			);
		default:
			return state;
	}
}

function player(state: PlayerState = defaultPlayerState, action: Action): PlayerState {
	switch(action.type) {
		case 'init-player':
			return {
				...state,
				deck: [
					new Copper,
					new Copper,
					new Copper,
					new Copper,
					new Copper,
					new Copper,
					new Copper,
					new Estate,
					new Estate,
					new Estate,
				]
			}
		default:
			return state;
	}
};

export default createStore(
	composeReducers(combineReducers({turn, supply, player}), gainCardReducer),
	applyMiddleware(
		thunk,
		logActions,
		playCard,
		buyCard,
	)
);
