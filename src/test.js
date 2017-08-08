/* @flow */

import j, {Woodcutter} from './';

j.subscribe(() => console.log(j.getState()));
j.dispatch({type: 'play-card', card: new Woodcutter});
