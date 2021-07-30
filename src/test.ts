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
	gainAction,
	chooseSupplyCardAction,
	askForSupplyCardAction,
	drawAction,
	ThroneRoom
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
	const state = store.getState()
	switch(action.type) {
		case 'ask-for-card': {
			const cards = state.player[action.from].filter(card => card instanceof action.cardType)

			await tick()

			if(cards.size > 0) {
				const { card }: { card: Card } = await prompt({
					type: 'select',
					name: 'card',
					message: `pick a ${action.cardType.friendlyName()} to play`,
					choices: cards.toArray().map((card, i) => ({
						title: card.toString(),
						value: card
					})).concat({
						title: 'nothing',
						value: undefined
					})
				})

				store.dispatch(chooseCardAction(card))
			} else {
				store.dispatch(chooseCardAction(undefined))
			}

			break;
		}
		case 'ask-for-supply-card': {
			const cardTypes = state.supply.keySeq().toArray()

			await tick()

			const { cardType }: { cardType: typeof Card } = await prompt({
				type: 'select',
				name: 'cardType',
				message: 'choose a card to buy',
				choices: cardTypes.filter(type => (
					type.cost(store.getState().turn) <= action.maxValue
					&& store.getState().supply.get(type).length > 0
				)).map((type, i) => ({
					title: type.toString() + ` $${type.cost(store.getState().turn)} (${store.getState().supply.get(type).length})`,
					value: type
				})).concat({
					title: 'nothing',
					value: undefined
				})
			})

			store.dispatch(chooseSupplyCardAction(cardType))
			break;
		}
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
		Woodcutter,
		ThroneRoom
	]))

	j.dispatch(initPlayerAction())
	j.dispatch(drawAction(5))
	j.dispatch(phaseAction('action'))
}

main()
