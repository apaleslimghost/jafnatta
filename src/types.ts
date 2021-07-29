
import {Map} from 'immutable';
import {Card, PlayableCard} from './cards/types';
import ExternalPromise from './external-promise';
import phases from './reducers/phases';

export type Phase = keyof typeof phases;

export type PlayCardAction = {type: 'play-card', card: PlayableCard};
export type AddActionAction = {type: 'add-action', amount: number};
export type AddBuyAction = {type: 'add-buy', amount: number};
export type AddCoinAction = {type: 'add-coin', amount: number};
export type PhaseAction = {type: 'phase', phase: Phase};
export type GainAction = {type: 'gain-card', card: typeof Card};
export type BuyAction = {type: 'buy-card', card: typeof Card};
export type InitPlayerAction = {type: 'init-player'};
export type InitSupplyAction = {type: 'init-supply', cards: Array<typeof Card>};
export type WaitForActionAction = {type: 'wait-for-action', action: string, promise: ExternalPromise<Action>};
export type AskForCardAction = {type: 'ask-for-card', from: keyof PlayerState, cardType: typeof Card};
export type ChooseCardAction = {type: 'choose-card', card: Card};
export type ChooseCardFromHandAction = {type: 'choose-card-from-hand', card: Card};

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
	| ChooseCardAction
	| ChooseCardFromHandAction;

export type ActionType = Action['type'];

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
	deck: Array<Card>,
	hand: Array<Card>,
	discard: Array<Card>,
	inPlay: Array<Card>,
};

export type State = {
	turn: TurnState,
	supply: Supply,
	player: PlayerState,
	wait: WaitState,
}

export type GetState = () => State;
export type PromiseAction = Promise<Action>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (
	action: Action | PromiseAction | Array<Action>
) => any;
