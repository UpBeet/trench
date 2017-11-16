import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

function view() {
  const attrs = {
    geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
    material: 'flatShading: true; color: red',
    position: '0 0 -0.1',
  };
  return xs.of(aEntity('.player', { attrs }));
}

function Player(sources) {
  const { DOM } = sources;
  const vdom$ = view();

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default Player;
