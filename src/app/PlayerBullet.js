import * as R from 'ramda';
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

import { aEntity } from './utils/AframeHyperscript';

function renderBullet([x, y, z]) {
  const attrs = {
    geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
    material: 'flatShading: true; color: red',
    position: `${x} ${y} ${z}`,
  };

  return aEntity('.bullet', { attrs });
}

function model(intents) {
  const { startPos$, frame$ } = intents;
  const zPos$ = frame$.fold(z => z - 0.01, -0.1);
  const pos$ = xs.combine(startPos$, zPos$).map(R.flatten);
  const remove$ = zPos$.filter(R.gte(-2.0));

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
