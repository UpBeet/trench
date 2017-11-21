import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

function intent(sources) {
  const { DOM } = sources;
  const collide$ = DOM.select('.enemy').events('collide');

  return {
    collide$,
  };
}

function model(actions) {
  const { collide$ } = actions;

  const position$ = xs.of([0, 0, -0.7]);
  const remove$ = xs.empty();
  const color$ = xs.merge(xs.of('green'), collide$.mapTo('blue'));

  return {
    position$,
    color$,
    remove$,
  };
}

function view(state$) {
  return state$
    .map(([[x, y, z], color]) => {
      const attrs = {
        geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
        material: `flatShading: true; color: ${color}`,
        position: `${x} ${y} ${z}`,
        'sphere-collision-target': 'targetType: enemy; radius: 0.01',
      };

      return aEntity('.enemy', { attrs });
    });
}

function EnemyObject(sources) {
  const actions = intent(sources);
  const { position$, color$, remove$ } = model(actions);
  const vdom$ = view(xs.combine(position$, color$));

  const sinks = {
    DOM: vdom$,
    remove$,
  };
  return sinks;
}

export default EnemyObject;
