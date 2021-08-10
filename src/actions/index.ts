import { Card } from "../cards/types";
import { ActionArgs, AddActionAction, AddBuyAction, AddCoinAction, BuyAction, DrawAction, GainAction, InitPlayerAction, InitSupplyAction, MoveCardAction, Phase, PhaseAction, PlayerState, ShuffleAction, TrashAction } from "../types";

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

export const moveCardAction = ({card, from, to}: ActionArgs<MoveCardAction>): MoveCardAction => ({
	type: 'move-card',
	card, from, to
})

export const shuffleAction = (): ShuffleAction => ({type: 'shuffle'})

export const trashAction = (card: Card, from: keyof PlayerState): TrashAction => ({
	type: 'trash',
	card,
	from
})
