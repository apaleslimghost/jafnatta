import j, { addInterface } from "."
import { Card, isType, TreasureCard, VictoryCard } from "./cards/types"
import { Action, State } from "./types"
import { drawAction, initPlayerAction, initPlayersAction, initSupplyAction, phaseAction } from "./actions"
import { inspectAction, inspectState } from "./inspect"
import { Copper, Gold, Platinum, Silver } from "./cards/treasure"
import { Duchy, Estate, Province } from "./cards/victory"
import Woodcutter from "./cards/action/woodcutter"
import ThroneRoom from "./cards/action/throne-room"
import { Chapel, Cellar, Village } from "./cards/action"
import Smithy from "./cards/action/smithy"
import Workshop from "./cards/action/workshop"
import Nobles from "./cards/nobles"

import React, { Fragment, FunctionComponent } from 'react'
import { Box, Newline, render, Spacer, Text } from 'ink'
import Select from 'ink-select-input'
import MultiSelect from 'ink-select-input'
import {Provider, useSelector, TypedUseSelectorHook} from 'react-redux/lib/alternate-renderers'

type CardPromptProps = {
	cards: Card[],
	onSelect: (card: Card) => void,
	amount?: number
}

const useAppSelector: TypedUseSelectorHook<State> = useSelector

const CardPrompt: FunctionComponent<CardPromptProps> = ({ cards, onSelect, amount = 1 }) => {
	const items = cards.map(card => ({
		label: card.toString(),
		value: card
	}))

	if(amount > 1) {
		return <MultiSelect
			items={items}
			onSelect={({ value }) => onSelect(value)}
			limit={amount}
		/>
	}

	return  <Select
		items={items}
		onSelect={({ value }) => onSelect(value)}
	/>
}

const typeColors = {
	Action: 'grayBright',
	Victory: 'green',
	Treasure: 'yellow'
}

type CardConstructor = { new(): Card }

const ShowCard: FunctionComponent<{Card: typeof Card}> = ({ Card, children }) => {
	const turn = useAppSelector(state => state.turn)
	const state = useAppSelector(state => state)
	const card = new (Card as unknown as CardConstructor)()

	return <Box borderStyle='round' width={20} minHeight={10} flexDirection='column' alignItems='stretch' paddingX={1}>
		<Box justifyContent='space-between'>
			<Text bold color='white'>{Card.toString()}</Text>
			<Text>${Card.cost(turn)}</Text>
		</Box>

		<Text>{Card.text}</Text>

		{children}

		<Spacer />

		{card.is(VictoryCard) && <Text>
			🛡 {card.getVictoryValue(state)}
		</Text>}

		<Box>
			{Card.types.map((type, i) => {
				const typeName = type.toString() as 'Action' | 'Victory' | 'Treasure'

				return <Fragment key={typeName}>
					<Text color={typeColors[typeName]}>
						{typeName}
					</Text>
					{i < Card.types.length - 1 && <Text dimColor> • </Text>}
				</Fragment>
			})}
		</Box>
	</Box>
}

render(
	<Provider store={j}>
		<ShowCard Card={Platinum} />
	</Provider>
)

// addInterface(store => next => async (action: Action) => {
// 	const state = store.getState()

// 	switch(action.type) {
// 		case 'ask-for-card': {
// 			const player = state.players.get(action.player)
// 			const availableCards = player[action.from].filter(card => card.is(action.cardType))

// 			if(availableCards.size > 0) {
// 				if(action.amount === 1) {
// 					const { card }: { card: Card } = await prompt({
// 						type: 'select',
// 						name: 'card',
// 						message: `pick a ${action.cardType.friendlyName()} to play`,
// 						choices: availableCards.toArray().map((card, i) => ({
// 							title: card.toString(),
// 							value: card
// 						})).concat({
// 							title: 'nothing',
// 							value: undefined
// 						}),
// 						onState
// 					})

// 					action.promise.resolve(card instanceof Card ? [card] : [])
// 				} else {
// 					const { cards }: { cards: Card[] } = await prompt({
// 						type: 'multiselect',
// 						name: 'cards',
// 						message: `pick up to ${action.amount} ${action.cardType.friendlyName()} to play`,
// 						choices: availableCards.toArray().map((card, i) => ({
// 							title: card.toString(),
// 							value: card
// 						}))
// 					})

// 					action.promise.resolve(cards)
// 				}
// 			} else {
// 				action.promise.resolve([])
// 			}

// 			break;
// 		}
// 		case 'ask-for-supply-card': {
// 			const cardTypes = state.supply.keySeq().toArray()

// 			await tick()

// 			const { cardType }: { cardType: typeof Card } = await prompt({
// 				type: 'select',
// 				name: 'cardType',
// 				message: 'choose a card to buy',
// 				choices: cardTypes.filter(type => (
// 					type.cost(store.getState().turn) <= action.maxValue
// 					&& store.getState().supply.get(type).length > 0
// 				)).map((type, i) => ({
// 					title: type.toString() + ` $${type.cost(store.getState().turn)} (${store.getState().supply.get(type).length})`,
// 					value: type
// 				})).concat({
// 					title: 'nothing',
// 					value: undefined
// 				})
// 			})

// 			action.promise.resolve(cardType instanceof Function ? cardType : undefined)
// 			break;
// 		}
// 		case 'choose-one': {
// 			const { choice } = await prompt({
// 				type: 'select',
// 				name: 'choice',
// 				message: 'choose one',
// 				choices: Object.entries(action.choices).map(
// 					([value, title]) => ({value, title})
// 				)
// 			})

// 			action.promise.resolve(choice)

// 			break
// 		}
// 		default:
// 			next(action)
// 	}
// })

// async function main() {
// 	j.dispatch(initSupplyAction([
// 		Copper,
// 		Estate,
// 		Woodcutter,
// 		ThroneRoom,
// 		Village,
// 		Smithy,
// 		Workshop,
// 		Chapel,
// 		Cellar,
// 		Nobles,
// 		Gold,
// 		Silver,
// 		Province,
// 		Duchy
// 	]))

// 	j.dispatch(initPlayersAction(2))
// }

// main()
