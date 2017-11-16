import * as R from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

function view(position$) {
  return position$
    .map(R.map(v => Math.floor(v * 100) / 1000))
    .map(([x, y]) => {
      const attrs = {
        geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
        material: 'flatShading: true; color: red',
        position: `${x} ${-y} -0.1`,
      };

      return aEntity('.player', { attrs });
    });
}

function Player(sources) {
  const { DOM, prop$ } = sources;
  const vdom$ = view(prop$);

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default Player;
