/* @flow */

import j, {
	inspectState,
	Woodcutter,
	Silver,
	Copper,
	initPlayerAction,
	initSupplyAction,
	buyAction,
	addCoinAction,
	phaseAction,
	playCardAction,
	waitForActionAction,
} from './';

j.subscribe(() => console.log(inspectState(j.getState())));
j.dispatch(waitForActionAction('add-coin')).then(console.log.bind(console, 'waited for'));
j.dispatch(addCoinAction(5));
