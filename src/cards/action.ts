
import { Card, ActionCard, type, AttackCard, Curse } from './types';
import { GetState, State, ThunkDispatch } from '../types';
import { askForCardAction } from '../actions/ask-for-card';
import { trashAction, addActionAction, drawAction, moveCardAction, gainAction } from '../actions';
import { ThunkAction } from 'redux-thunk';

@type(ActionCard)
export class Village extends Card {
	static cost = () => 3
	static text = `+1 Card
+2 Actions`

	onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		dispatch(addActionAction(2, player))
		dispatch(drawAction(1, player))
	}
}

@type(ActionCard)
export class Chapel extends Card {
	static cost = () => 2
	static text = `Trash up to 4 cards from your hand.`

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const cards = await dispatch(askForCardAction(
			'hand',
			Card,
			player,
			4
		))

		for(const card of cards) {
			dispatch(trashAction(card, 'hand', player))
		}
	}
}

@type(ActionCard)
export class Cellar extends Card {
	static cost = () => 2
	static text = `+1 Action
Discard any number of cards, then draw that many.`

	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		const cards = await dispatch(askForCardAction(
			'hand',
			Card,
			player,
			Infinity
		))

		dispatch(addActionAction(1, player))

		for(const card of cards) {
			dispatch(moveCardAction({ card, from: 'hand', to: 'discard', player }))
		}

		dispatch(drawAction(cards.length, player))
	}
}

@type(ActionCard) @type(AttackCard)
export class Witch extends Card {
	static text = `+2 cards
Each other player gains a Curse.`
	static cost = () => 5
	async onPlay(dispatch: ThunkDispatch, state: State, player: string) {
		dispatch(drawAction(2, player))

		const players = state.players.keySeq().toArray()
		const index = players.indexOf(player)
		const otherPlayers = players.slice(index + 1).concat(players.slice(0, index))

		for(const player of otherPlayers) {
			await dispatch(gainAction({ card: Curse, player }))
		}
	}
}
