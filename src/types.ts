
import { Middleware as BaseMiddleware } from 'redux';
import { Map, OrderedSet, Set } from 'immutable';
import {ThunkAction, ThunkDispatch as BaseThunkDispatch} from 'redux-thunk';
import {Card, PlayableCard} from './cards/types';
import ExternalPromise from './external-promise';
import phases from './reducers/phases';

export type Phase = keyof typeof phases;

export type PlayCardAction = {type: 'play-card', card: PlayableCard };
export type AddActionAction = {type: 'add-action', amount: number};
export type AddBuyAction = {type: 'add-buy', amount: number};
export type AddCoinAction = {type: 'add-coin', amount: number};
export type PhaseAction = {type: 'phase', phase: Phase};
export type GainAction = {type: 'gain-card', card: typeof Card, where?: keyof PlayerState};
export type BuyAction = {type: 'buy-card', card: typeof Card};
export type InitPlayerAction = {type: 'init-player'};
export type InitSupplyAction = {type: 'init-supply', cards: Array<typeof Card>};
export type WaitForActionAction = {type: 'wait-for-action', action: string, promise: ExternalPromise<Action>};
export type AskForCardAction = {type: 'ask-for-card', from: keyof PlayerState, cardType: typeof Card, promise: ExternalPromise<Card[]>, amount: number};
export type AskForSupplyCardAction = {type: 'ask-for-supply-card', maxValue: number, promise: ExternalPromise<typeof Card>}
export type DrawAction = {type: 'draw', amount: number}
export type MoveCardAction = {type: 'move-card', card: Card, from: keyof PlayerState, to: keyof PlayerState}
export type ShuffleAction = {type: 'shuffle'}
export type TrashAction = {type: 'trash', card: Card, from: keyof PlayerState}

export type Action =
	| PlayCardAction
	| AddActionAction
	| AddBuyAction
	| AddCoinAction
	| PhaseAction
	| GainAction
	| BuyAction
	| InitPlayerAction
	| InitSupplyAction
	| WaitForActionAction
	| AskForCardAction
	| AskForSupplyCardAction
	| DrawAction
	| MoveCardAction
	| ShuffleAction
	| TrashAction;

export type ActionType = Action['type'];
export type ActionFromType<T extends ActionType> = Extract<Action, {type: T}>
export type ActionArgs<T extends Action> = Omit<T, 'type'>

export type WaitState = {
	action?: string,
	promise?: ExternalPromise<Action>,
};

export type TurnState = {
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
	player: PlayerState,
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
