
import {List} from 'immutable';
import {PlayerState, Supply, State, TurnState, WaitState, Action} from './types';
import {Card} from './cards/types';
import * as util from 'util'

util.inspect.styles.name = 'cyan'

export const inspectState = (state: State): string => 'State ' + util.inspect({
	Turn: state.turn,
	Player: Object.fromEntries(
		Object.entries(state.player).map(([k, v]) => [k, v.toJS()])
	),
	Supply: state.supply.map(cards => cards.length).toJS(),
	Trash: state.trash.size + ' cards'
}, {colors: true}) + '\n'

export const inspectAction = (action: Action): string => 'Action ' + util.inspect(action, {colors: true}) + '\n'
