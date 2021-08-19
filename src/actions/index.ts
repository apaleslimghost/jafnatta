import { Card } from "../cards/types";
import { ActionArgs, AddActionAction, AddBuyAction, AddCoinAction, BuyAction, DrawAction, GainAction, InitPlayerAction, InitPlayersAction, InitSupplyAction, MoveCardAction, Phase, PhaseAction, PlayerState, ShuffleAction, TrashAction } from "../types";

export const initSupplyAction = (
	cards: Array<typeof Card>
): InitSupplyAction => ({ type: 'init-supply', cards });

export const addActionAction = (amount: number, player: string): AddActionAction => ({
	type: 'add-action',
	amount,
	player
});

export const addBuyAction = (amount: number, player: string): AddBuyAction => ({
	type: 'add-buy',
	amount,
	player
});

export const addCoinAction = (amount: number, player: string): AddCoinAction => ({
	type: 'add-coin',
	amount,
	player
});

export const phaseAction = (phase: Phase): PhaseAction => ({
	type: 'phase',
	phase,
});

export const gainAction = ({card, player, where = 'discard'}: ActionArgs<GainAction>): GainAction => ({
	type: 'gain-card',
	card,
	player,
	where
});

export const buyAction = (card: typeof Card, player: string): BuyAction => ({
	type: 'buy-card',
	card,
	player
});

export const drawAction = (amount: number, player: string): DrawAction => ({
	type: 'draw',
	amount,
	player
})

export const initPlayerAction = (player: string): InitPlayerAction => ({
	type: 'init-player',
	player
});

export const initPlayersAction = (number: number): InitPlayersAction => ({
	type: 'init-players',
	number
});

export const moveCardAction = ({card, from, to, player}: ActionArgs<MoveCardAction>): MoveCardAction => ({
	type: 'move-card',
	card, from, to, player
})

export const shuffleAction = (player: string): ShuffleAction => ({
	type: 'shuffle',
	player
})

export const trashAction = (card: Card, from: keyof PlayerState, player: string): TrashAction => ({
	type: 'trash',
	card,
	from,
	player
})
