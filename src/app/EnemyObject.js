import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

function intent(sources) {
  const { DOM, startPos$ } = sources;
  const collide$ = DOM.select('.enemy').events('collide');

  return {
    collide$,
    startPos$,
  };
}

function model(actions) {
  const { collide$, startPos$ } = actions;

  // temp rando position bs until we figure out how to move em
  const x = 0.025 - (0.05 * Math.random());
  const y = 0.025 - (0.05 * Math.random());
  const position$ = startPos$.map(() => [x, y, -0.5]);
  const remove$ = collide$;
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
