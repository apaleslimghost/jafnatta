import { Card } from "../cards/types";
import { ActionArgs, AddActionAction, AddBuyAction, AddCoinAction, BuyAction, ChooseCardAction, ChooseSupplyCardAction, DrawAction, GainAction, InitPlayerAction, InitSupplyAction, MoveCardAction, Phase, PhaseAction, ShuffleAction } from "../types";

export const initSupplyAction = (
	cards: Array<typeof Card>
): InitSupplyAction => ({ type: 'init-supply', cards });

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


export const chooseCardAction = (card: Card): ChooseCardAction => ({
	type: 'choose-card',
	card,
});

export const chooseSupplyCardAction = (cardType: typeof Card): ChooseSupplyCardAction => ({
	type: 'choose-supply-card',
	cardType,
});

export const moveCardAction = ({card, from, to}: ActionArgs<MoveCardAction>): MoveCardAction => ({
	type: 'move-card',
	card, from, to
})

export const shuffleAction = (): ShuffleAction => ({type: 'shuffle'})
