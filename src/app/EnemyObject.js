import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

function intent(sources) {
  return {};
}

function model(actions) {
  const state$ = xs.of([0, 0, -1]);
  const remove$ = xs.empty();

  return {
    state$,
    remove$,
  };
}

function view(state$) {
  return state$
    .map(([x, y, z]) => {
      const attrs = {
        geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
        material: 'flatShading: true; color: green',
        position: `${x} ${y} ${z}`,
        'sphere-collision-target': 'targetType: enemy; radius: 0.01',
      };

      return aEntity('.enemy', { attrs });
    });
}

function EnemyObject(sources) {
  const actions = intent(sources);
  const { state$, remove$ } = model(actions);
  const vdom$ = view(state$);

  const sinks = {
    DOM: vdom$,
    remove$,
  };
  return sinks;
}

export default EnemyObject;
