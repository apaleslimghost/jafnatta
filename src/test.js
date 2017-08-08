/* @flow */

import j, {Woodcutter, Silver} from './';

j.subscribe(() => console.log(j.getState()));
j.dispatch({type: 'play-card', card: new Woodcutter});
j.dispatch({type: 'phase', phase: 'buy'});
j.dispatch({type: 'play-card', card: new Silver});
