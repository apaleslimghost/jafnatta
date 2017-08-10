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
} from './';

j.subscribe(() => console.log(inspectState(j.getState())));
j.dispatch(initPlayerAction());
j.dispatch(initSupplyAction([Woodcutter, Silver]));
j.dispatch(addCoinAction(5));
j.dispatch(playCardAction(new Woodcutter));
j.dispatch(phaseAction('buy'));
j.dispatch(buyAction(Woodcutter));
