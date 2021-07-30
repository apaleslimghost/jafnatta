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
} from './';
import playCardAction from './actions/play-card'
import ActionCard from './cards/action'

import { inspectState } from './inspect';

import prompt from 'prompts'
import { Card } from './cards/types';

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

	const { hand } = j.getState().player
	const { card }: { card: Card } = await prompt({
		type: 'select',
		name: 'card',
		message: 'pick a card',
		choices: hand.map((card, i) => ({
			title: card.toString(),
			value: card
		}))
	})

	console.log(card)

	// j.dispatch(askForCardAction('hand', ActionCard)) //.then(console.log.bind(console, 'card from hand'));
	// j.dispatch(chooseCardAction())
	// j.dispatch(addCoinAction(5));
}

main()
