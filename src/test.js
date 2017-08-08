/* @flow */

import j, {Woodcutter, Silver} from './';

j.subscribe(() => console.log(j.getState()));
j.dispatch({type: 'init-supply', cards: [Woodcutter, Silver]});
j.dispatch({type: 'gain-card', card: Woodcutter});
