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
} from './';
import playCardAction from './actions/play-card'
import ActionCard from './cards/action'

import inspectState from './inspect';

j.subscribe(() => console.log(inspectState(j.getState())));
j.dispatch(askForCardAction('hand', ActionCard)) //.then(console.log.bind(console, 'card from hand'));
j.dispatch(addCoinAction(5));
