import j, {
	Woodcutter,
	Silver,
	Copper,
	initPlayerAction,
	initSupplyAction,
	buyAction,
	addCoinAction,
	phaseAction,
	askForCardAction,
	chooseCardAction,
	Estate,
	addInterface,
	gainAction
} from './';
import playCardAction from './actions/play-card'
import ActionCard from './cards/action'

import { inspectState } from './inspect';

import prompt from 'prompts'
import { Card } from './cards/types';
import { Action, AskForCardAction } from './types';
import TreasureCard from './cards/treasure';

const tick = () => new Promise(resolve => process.nextTick(resolve))

addInterface(store => next => async (action: Action) => {
	switch(action.type) {
		case 'ask-for-card':
			const state = store.getState()
			const cards = state.player[action.from].filter(card => card instanceof action.cardType)

			if(cards.length > 0) {
				const { card }: { card: Card } = await prompt({
					type: 'select',
					name: 'card',
					message: 'pick a card',
					choices: cards.map((card, i) => ({
						title: card.toString(),
						value: card
					}))
				})

				store.dispatch(chooseCardAction(card))
			} else {
				await tick()
				store.dispatch(chooseCardAction(undefined))
			}

			break;
		default:
			next(action)
	}
})

async function main() {
	j.subscribe(() => console.log(
		inspectState(j.getState()) + '\n'
		+ '═'.repeat(process.stdout.columns) + '\n'
	));

	j.dispatch(initSupplyAction([
		Copper,
		Estate,
		Woodcutter
	]))

	j.dispatch(initPlayerAction())

	while(j.getState().turn.actions > 0) {
		const { card } = await j.dispatch(askForCardAction('hand', ActionCard))

		if(card instanceof ActionCard) {
			await j.dispatch(playCardAction(card))
		} else {
			console.log('no action cards in hard')
			break
		}
	}

	j.dispatch(phaseAction('buy'))

	while(true) {
		const { card } = await j.dispatch(askForCardAction('hand', TreasureCard))

		if(card instanceof TreasureCard) {
			await j.dispatch(playCardAction(card))
		} else {
			console.log('no treasure cards in hard')
			break
		}
	}
}

main()
