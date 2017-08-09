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
} from './';

j.subscribe(() => console.log(inspectState(j.getState())));
j.dispatch(initPlayerAction());
j.dispatch(initSupplyAction([Woodcutter, Silver]));
j.dispatch(addCoinAction(5));
j.dispatch(phaseAction('buy'));
j.dispatch(buyAction(Woodcutter));
