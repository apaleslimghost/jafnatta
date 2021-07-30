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
import { Action } from './types';
import TreasureCard from './cards/treasure';

addInterface(store => next => async (action: Action) => {
	switch(action.type) {
		case 'ask-for-card':
			console.log(action.cardType)
			const state = store.getState()
			const cards = state.player[action.from].filter(card => card instanceof action.cardType)

			console.log(cards)

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

			break;
		default:
			next(action)
	}
})

async function main() {
	// j.subscribe(() => console.log(
	// 	inspectState(j.getState()) + '\n'
	// 	+ '═'.repeat(process.stdout.columns) + '\n'
	// ));

	j.dispatch(initSupplyAction([
		Copper,
		Estate,
		Woodcutter
	]))

	j.dispatch(initPlayerAction())

	const { card } = await j.dispatch(askForCardAction('hand', TreasureCard))
	console.log(card)
	// j.dispatch(chooseCardAction())
	// j.dispatch(addCoinAction(5));
}

main()
