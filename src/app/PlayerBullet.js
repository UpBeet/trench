import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

// Random Constants of the class
const SPEED = 0.02;
const START_Z = -0.1;
const END_Z = -2.0;

function renderBullet([x, y, z]) {
  const attrs = {
    geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
    material: 'flatShading: true; color: red',
    position: `${x} ${y} ${z}`,
    'sphere-collision': 'targetType: enemy; radius: 0.01',
  };

  return aEntity('.bullet', { attrs });
}

function model(intents) {
  const { startPos$, frame$ } = intents;
  const zPos$ = frame$.fold(z => z - SPEED, START_Z);
  const pos$ = xs.combine(startPos$, zPos$).map(R.flatten);
  const remove$ = zPos$.filter(R.gte(END_Z));

  return {
    pos$,
    remove$,
  };
}

function PlayerBullet(sources) {
  const state = model(sources);
  const vdom$ = state.pos$.map(renderBullet);

  return {
    DOM: vdom$,
    remove$: state.remove$,
  };
}

export default PlayerBullet;
