import j, { addInterface, addReducer } from "."
import { Card, Curse, isType, TreasureCard, VictoryCard } from "./cards/types"
import { Action, AskForCardAction, AskForSupplyCardAction, ChooseOneAction, State } from "./types"
import { createPlayersAction, drawAction, initPlayerAction, initPlayersAction, initSupplyAction, phaseAction } from "./actions"
import { inspectAction, inspectState } from "./inspect"
import { Copper, Gold, Platinum, Silver } from "./cards/treasure"
import { Duchy, Estate, Province } from "./cards/victory"
import Woodcutter from "./cards/action/woodcutter"
import ThroneRoom from "./cards/action/throne-room"
import { Chapel, Cellar, Village, Witch } from "./cards/action"
import Smithy from "./cards/action/smithy"
import Workshop from "./cards/action/workshop"
import Nobles from "./cards/nobles"

import React, { Children, Fragment, FunctionComponent, useEffect, useState } from 'react'
import { Box, Newline, render, Spacer, Static, Text, useInput, useStdout } from 'ink'
import Select from 'ink-select-input'
import MultiSelect from 'ink-multi-select'
import {Provider, useSelector, TypedUseSelectorHook, useDispatch} from 'react-redux/lib/alternate-renderers'
import { Store } from "redux"
import { askForSupplyCardAction } from "./actions/ask-for-supply-card"
import { askForCardAction } from "./actions/ask-for-card"

type CardPromptProps = {
	cards: Card[],
	onSelect: (cards: Card[]) => void,
	amount: number
}

const useAppSelector: TypedUseSelectorHook<State> = useSelector

const CardPrompt: FunctionComponent<CardPromptProps> = ({ cards, onSelect, amount }) => {
	const items = cards.map((card, i) => ({
		label: card.toString(),
		value: card,
		key: String(i)
	}))

	if(amount > 1) {
		return <MultiSelect
			// types for library are wrong, cast items to any
			items={items as any}
			onSubmit={items => onSelect(items.map(item => item.value as any))}
			limit={amount}
		/>
	}

	return  <Select
		items={items}
		onSelect={({ value }) => onSelect([ value ])}
	/>
}

const typeColors = {
	Action: 'grayBright',
	Victory: 'green',
	Treasure: 'yellow'
}

type CardConstructor = { new(): Card }

const ShowCard: FunctionComponent<{Card: typeof Card, selected?: boolean, compact?: boolean}> = ({ Card, selected, compact }) => {
	const turn = useAppSelector(state => state.turn)
	const state = useAppSelector(state => state)
	const card = new (Card as unknown as CardConstructor)()

	return <Box borderStyle={selected ? 'bold': 'round'} borderColor={selected ? 'whiteBright' : 'gray'} width={compact ? 10 : 20} height={compact ? 6 : 10} flexDirection='column' paddingX={1}>
		<Box justifyContent='space-between' marginBottom={1}>
			<Text bold color='white'>{Card.toString()}</Text>
			{!compact && <Text>${Card.cost(turn)}</Text>}
		</Box>

		{!compact && <>
			<Text>{Card.text}</Text>

			{card.is(VictoryCard) && <Text>
				🛡 {card.getVictoryValue(state)}
			</Text>}
		</>}

		<Spacer />

		<Box marginTop={1} justifyContent='space-around'>
			{Card.types.map((type, i) => {
				const typeName = type.toString() as 'Action' | 'Victory' | 'Treasure'

				return <Fragment key={typeName}>
					<Text color={typeColors[typeName]}>
						{compact ? typeName[0] : typeName}
					</Text>
					{i < Card.types.length - 1 && <Text dimColor> • </Text>}
				</Fragment>
			})}
		</Box>
	</Box>
}

const CardGrid: FunctionComponent<{cards: (typeof Card)[], onSelect?: (card: typeof Card) => void, compact?: boolean}> = ({ cards, onSelect, compact }) => {
	const { stdout } = useStdout()
	const columns = Math.floor(stdout.columns / (compact ? 10 : 20))
	const rows = Math.ceil(cards.length / columns)

	const [selectedRow, setRow] = useState(0)
	const [selectedColumn, setColumn] = useState(0)

	useInput((input, key) => {
		if(key.leftArrow) {
			setColumn(c => ((c - 1) + columns) % columns)
		}
		if(key.rightArrow) {
			setColumn(c => ((c + 1) + columns) % columns)
		}
		if(key.upArrow) {
			setRow(r => ((r - 1) + rows) % rows)
		}
		if(key.downArrow) {
			setRow(r => ((r + 1) + rows) % rows)
		}
		if(key.return && onSelect) {
			onSelect(cards[selectedRow * columns + selectedColumn])
		}
	})

	return <Box flexDirection='column'>
		{Array.from({ length: rows }, (_, row) => <Box key={row}>
			{cards.slice(columns * row, columns * row + columns).map((card, column) => (
				<ShowCard key={column} Card={card} selected={onSelect && column === selectedColumn && row === selectedRow} compact={compact} />
			))}
		</Box>)}
	</Box>
}

const ShowSupply: FunctionComponent<AskForSupplyCardAction> = ({ promise, maxValue }) => {
	const turn = useAppSelector(state => state.turn)
	const supply = useAppSelector(state => state.supply.filter(
		(pile, card) => card.cost(turn) <= maxValue
	))

	return <CardGrid cards={supply.keySeq().toArray()} onSelect={card => promise.resolve(card)} />
}

const ChooseCard: FunctionComponent<AskForCardAction> = ({ cardType, from, player: playerId, promise, amount }) => {
	const player = useAppSelector(state => state.players.get(playerId))
	const availableCards = player[from].filter(card => card.is(cardType))

	useEffect(() => {
		if(availableCards.size === 0) {
			promise.resolve([])
		}
	}, [availableCards])

	return <CardPrompt cards={availableCards.toArray()} amount={amount} onSelect={card => promise.resolve(card)} />
}

const ChooseOne: FunctionComponent<ChooseOneAction> = ({ choices, promise }) => {
	return <Select items={
		Object.entries(choices).map(([value, label]) => ({ value, label }))
	} onSelect={({value}) => promise.resolve(value)} />
}

const ShowTurn: FunctionComponent = () => {
	const turn = useAppSelector(state => state.turn)
	const player = useAppSelector(state => state.players.get(turn.player))

	return player ? <Box borderStyle='round' borderColor='gray' paddingX={1} flexDirection='column'>
		<Box>
			<Text bold>{turn.player}</Text>
			<Spacer />
			<Text>{turn.actions} actions</Text>
			<Text dimColor> • </Text>
			<Text>${turn.coins}</Text>
			<Text dimColor> • </Text>
			<Text>{turn.buys} buys</Text>
		</Box>
		<Box>
			<CardGrid cards={player.hand.toArray().map(card => card.constructor as (typeof Card))} compact />
			<Spacer />
			<Box width={10} height={6} borderStyle={player.deck.size > 1 ? 'doubleSingle' : 'single'} borderColor={player.deck.size > 0 ? 'gray' : 'blackBright'} flexDirection='column'>
				<Text>deck</Text>
				<Text>{player.deck.size} cards</Text>
			</Box>
			<Box width={10} height={6} borderStyle={player.discard.size > 1 ? 'doubleSingle' : 'single'} borderColor={player.discard.size > 0 ? 'gray' : 'blackBright'} flexDirection='column'>
				<Text>discard</Text>
				<Text>{player.discard.size} cards</Text>
			</Box>
		</Box>
		{player.inPlay.size > 0 &&
			<Box flexDirection='column'>
				<Text>in play</Text>
				<CardGrid cards={player.inPlay.toArray().map(card => card.constructor as (typeof Card))} compact />
			</Box>
		}
	</Box> : null
}

const App: FunctionComponent = () => {
	const [waitingFor, setWaitingFor] = useState<Action>()
	const dispatch = useDispatch()

	addInterface(store => next => (action: Action) => {
		if('promise' in action) {
			setWaitingFor(action)
			action.promise.finally(() => {
				setWaitingFor(null)
			})
		} else {
			next(action)
		}
	})

	return <>
		<ShowTurn />

		{waitingFor && waitingFor.type === 'ask-for-supply-card' && (
			<ShowSupply {...waitingFor} />
		)}

		{waitingFor && waitingFor.type === 'ask-for-card' && (
			<ChooseCard {...waitingFor} />
		)}
	</>
}

render(<Provider store={j}><App /></Provider>)


j.dispatch(createPlayersAction(2))

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
	Duchy,
	Curse,
	Witch
]))

j.dispatch(initPlayersAction())
