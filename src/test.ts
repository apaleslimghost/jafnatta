import j, { addInterface } from "."
import { Card } from "./cards/types"
import { Action } from "./types"
import prompt from 'prompts'
import { drawAction, initPlayerAction, initPlayersAction, initSupplyAction, phaseAction } from "./actions"
import { inspectState } from "./inspect"
import { Copper, Gold, Silver } from "./cards/treasure"
import { Duchy, Estate, Province } from "./cards/victory"
import Woodcutter from "./cards/action/woodcutter"
import ThroneRoom from "./cards/action/throne-room"
import { Chapel, Cellar, Village } from "./cards/action"
import Smithy from "./cards/action/smithy"
import Workshop from "./cards/action/workshop"
import Nobles from "./cards/nobles"

const tick = () => new Promise(resolve => process.nextTick(resolve))
const onState = ({aborted}: {aborted: boolean}) => {
	if(aborted) {
		process.stderr.write('\u001B[?25h');
		console.log(`\ngoodbye! ${process.env.WATCH ? 'jafnatta will run again on file change. ctrl-C again to exit compiler' : ''}`)
		process.exit(2)
	}
}

addInterface(store => next => async (action: Action) => {
	const state = store.getState()

	switch(action.type) {
		case 'ask-for-card': {
			const player = state.players.get(action.player)
			const availableCards = player[action.from].filter(card => card.is(action.cardType))

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
						}),
						onState
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
		case 'choose-one': {
			const { choice } = await prompt({
				type: 'select',
				name: 'choice',
				message: 'choose one',
				choices: Object.entries(action.choices).map(
					([value, title]) => ({value, title})
				)
			})

			action.promise.resolve(choice)

			break
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
		Smithy,
		Workshop,
		Chapel,
		Cellar,
		Nobles,
		Gold,
		Silver,
		Province,
		Duchy
	]))

	j.dispatch(initPlayersAction(2))
	// j.dispatch(drawAction(5))
	// j.dispatch(phaseAction('action'))
}

main()
