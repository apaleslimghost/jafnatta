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

import inspectState from './inspect';

j.subscribe(() => console.log(inspectState(j.getState()) + '\n'));

j.dispatch(initSupplyAction([
	Copper,
	Estate,
	Woodcutter
]))

j.dispatch(initPlayerAction())

j.dispatch(askForCardAction('hand', ActionCard)) //.then(console.log.bind(console, 'card from hand'));
// j.dispatch(chooseCardAction())
j.dispatch(addCoinAction(5));
