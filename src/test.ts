import j, { addInterface } from "."
import { Card } from "./cards/types"
import { Action } from "./types"
import prompt from 'prompts'
import { drawAction, initPlayerAction, initSupplyAction, phaseAction } from "./actions"
import { inspectState } from "./inspect"
import { Copper } from "./cards/treasure"
import { Estate } from "./cards/victory"
import Woodcutter from "./cards/action/woodcutter"
import ThroneRoom from "./cards/action/throne-room"
import { Chapel, Village } from "./cards/action"

const tick = () => new Promise(resolve => process.nextTick(resolve))

addInterface(store => next => async (action: Action) => {
	const state = store.getState()

	switch(action.type) {
		case 'ask-for-card': {
			const availableCards = state.player[action.from].filter(card => card instanceof action.cardType)

			await tick()


			if(availableCards.size > 0) {
				if(action.amount === 1) {
					const { card }: { card: Card } = await prompt({
						type: 'select',
						name: 'card',
						message: `pick a ${action.cardType.friendlyName()} to play`,
						choices: availableCards.toArray().map((card, i) => ({
							title: card.toString(),
							value: card
						})).concat({
							title: 'nothing',
							value: undefined
						})
					})

					action.promise.resolve(card instanceof Card ? [card] : [])
				} else {
					const { cards }: { cards: Card[] } = await prompt({
						type: 'multiselect',
						name: 'cards',
						message: `pick up to ${action.amount} ${action.cardType.friendlyName()} to play`,
						choices: availableCards.toArray().map((card, i) => ({
							title: card.toString(),
							value: card
						}))
					})

					action.promise.resolve(cards)
				}
			} else {
				action.promise.resolve([])
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

			action.promise.resolve(cardType instanceof Function ? cardType : undefined)
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
		ThroneRoom,
		Village,
		Chapel
	]))

	j.dispatch(initPlayerAction())
	j.dispatch(drawAction(5))
	j.dispatch(phaseAction('action'))
}

main()
