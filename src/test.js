/* @flow */

import j, {Woodcutter, Silver, Copper, initPlayerAction, initSupplyAction, buyAction} from './';

j.subscribe(() => console.log(j.getState()));
j.dispatch(initPlayerAction());
j.dispatch(initSupplyAction([Woodcutter, Silver]));
