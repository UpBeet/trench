import * as R from 'ramda';
import * as THREE from 'three';
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

import { aEntity } from './utils/AframeHyperscript';

const SPEED = 0.00003;

// This needs to actually scale the vector here, but whatever :/
function calcMovement([prevX, prevY], [delta, target]) {
  // This is me trying to avoid if statements
  const deltaX = SPEED * delta * (prevX > target[0] ? -1 : 1);
  const deltaY = SPEED * delta * (prevY > target[1] ? -1 : 1);

  const xDiff = prevX - target[0];
  const yDiff = prevY - target[1];
  const newX = (xDiff < 0.001 && xDiff > -0.001) ? prevX : prevX + deltaX;
  const newY = (yDiff < 0.001 && yDiff > -0.001) ? prevY : prevY + deltaY;

  return [newX, newY];
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

  const state$ = frame$
    .compose(sampleCombine(scaledTarget$))
    .fold(calcMovement, [0, 0]);

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
    state$,
  };
  return sinks;
}

export default Player;
