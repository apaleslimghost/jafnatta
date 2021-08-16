
import {State, TurnState, Dispatch, GetState} from '../types';
import { noCase } from 'no-case'
import * as util from 'util'

abstract class Named {
	static displayName?: string

	static toString() {
		return this.displayName || this.name
	}

	static friendlyName() {
		return noCase(this.toString())
	}

	toString() {
		return (this.constructor as typeof Named).friendlyName()
	}

	static [util.inspect.custom]() {
		return this.toString()
	}

	[util.inspect.custom]() {
		return this.toString()
	}
}

export abstract class Card extends Named {
	static displayName: string
	static text?: string
	static cost(_: TurnState): number { return NaN }
	static numberInSupply(_: State): number { return 10 }
	static types: (typeof Card)[]

	is<T extends typeof Card>(type: T): this is T {
		if(type === Card) {
			return true
		}

		return (this.constructor as typeof Card).types.includes(type)
	}
}

export const type = <C extends typeof Card>(type: C) => <T extends typeof Card>(klass: C & T) => {
	klass.types ||= []
	klass.types.push(type)
}

export abstract class PlayableCard extends Card {
	abstract onPlay(_: Dispatch, __: GetState): void | Promise<void>
}

export abstract class ActionCard extends PlayableCard {
	static displayName = 'Action'
}

export abstract class TreasureCard extends PlayableCard {
	static displayName = 'Treasure'
}

export abstract class VictoryCard extends Card {
	static displayName = 'Victory'
	abstract getVictoryValue(_: State): number
}
