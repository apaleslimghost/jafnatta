
import { Middleware as BaseMiddleware } from 'redux';
import { Map, OrderedMap, OrderedSet, Set } from 'immutable';
import {ThunkAction, ThunkDispatch as BaseThunkDispatch} from 'redux-thunk';
import {Card, PlayableCard} from './cards/types';
import ExternalPromise from './external-promise';
import phases from './reducers/phases';

export type Phase = keyof typeof phases;

export type PlayCardAction = {type: 'play-card', card: PlayableCard };
export type AddActionAction = {type: 'add-action', amount: number, player: string };
export type AddBuyAction = {type: 'add-buy', amount: number, player: string };
export type AddCoinAction = {type: 'add-coin', amount: number, player: string };
export type PhaseAction = {type: 'phase', phase: Phase};
export type TurnAction = {type: 'turn', player: ID}
export type GainAction = {type: 'gain-card', card: typeof Card, player: ID, where?: keyof PlayerState };
export type BuyAction = {type: 'buy-card', card: typeof Card, player: string};
export type InitPlayerAction = {type: 'init-player', player: ID };
export type InitPlayersAction = {type: 'init-players', number: number};
export type InitSupplyAction = {type: 'init-supply', cards: Array<typeof Card>};
export type WaitForActionAction = {type: 'wait-for-action', action: string, promise: ExternalPromise<Action>};
export type AskForCardAction = {type: 'ask-for-card', from: keyof PlayerState, cardType: typeof Card, promise: ExternalPromise<Card[]>, amount: number, player: string };
export type AskForSupplyCardAction = {type: 'ask-for-supply-card', maxValue: number, promise: ExternalPromise<typeof Card>}
export type DrawAction = {type: 'draw', amount: number, player: string}
export type MoveCardAction = {type: 'move-card', card: Card, from: keyof PlayerState, to: keyof PlayerState, player: string}
export type ShuffleAction = {type: 'shuffle', player: string}
export type TrashAction = {type: 'trash', card: Card, from: keyof PlayerState, player: string }
export type ChooseOneAction = {type: 'choose-one', choices: { [key: string]: string }, promise: ExternalPromise<string | number> }

export type Action =
	| PlayCardAction
	| AddActionAction
	| AddBuyAction
	| AddCoinAction
	| PhaseAction
	| TurnAction
	| GainAction
	| BuyAction
	| InitPlayerAction
	| InitPlayersAction
	| InitSupplyAction
	| WaitForActionAction
	| AskForCardAction
	| AskForSupplyCardAction
	| DrawAction
	| MoveCardAction
	| ShuffleAction
	| TrashAction
	| ChooseOneAction

export type ActionType = Action['type'];
export type ActionFromType<T extends ActionType> = Extract<Action, {type: T}>
export type ActionArgs<T extends Action> = Omit<T, 'type'>

export type WaitState = {
	action?: string,
	promise?: ExternalPromise<Action>,
};

export type ID = string

export type TurnState = {
	player: ID,
	actions: number,
	buys: number,
	coins: number,
	phase: Phase,
};

export type Supply = Map<typeof Card, Array<Card>>;

export type PlayerState = {
	deck: OrderedSet<Card>,
	hand: OrderedSet<Card>,
	discard: OrderedSet<Card>,
	inPlay: OrderedSet<Card>,
};

export type State = {
	turn: TurnState,
	supply: Supply,
	players: OrderedMap<ID, PlayerState>,
	trash: Set<Card>
}

export type GetState = () => State;
export type PromiseAction = Promise<Action>;
export type Dispatch = (
	action: Action | PromiseAction | Array<Action>
) => any;

export type ThunkResult<R> = ThunkAction<R, State, undefined, Action>;
export type ThunkDispatch = BaseThunkDispatch<State, undefined, Action>;
export type Middleware = BaseMiddleware<{}, State, ThunkDispatch>;
