import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

const SPEED = 0.000001;

function calcMovement([prevX, prevY], [target, delta]) {
  const deltaX = SPEED * delta * (prevX > target[0] ? -1 : 1);
  const deltaY = SPEED * delta * (prevY > target[1] ? -1 : 1);

  return [prevX + deltaX, prevY + deltaY];
}

function intent(sources) {
  const { move$, frame$ } = sources;

  return {
    target$: move$,
    frame$: frame$.map(R.prop('delta')),
  };
}

function model(intents) {
  const { target$, frame$ } = intents;
  const scaledTarget$ = target$
    .map(R.map(v => Math.floor(v * 100) / 1000))
    .map(([x, y]) => [x, -y]);

  const state$ = xs.combine(scaledTarget$, frame$).fold(calcMovement, [0, 0]);

  return state$;
}

function view(state$) {
  return state$
    .map(([x, y]) => {
      const attrs = {
        geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
        material: 'flatShading: true; color: red',
        position: `${x} ${y} -0.1`,
      };

      return aEntity('.player', { attrs });
    });
}

function Player(sources) {
  const intents = intent(sources);
  const state$ = model(intents);
  const vdom$ = view(state$);

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default Player;
