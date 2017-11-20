import * as R from 'ramda';
import { Vector2 } from 'three';
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

import { aEntity } from './utils/AframeHyperscript';

const SPEED = 0.003;
const MOVE_DIST_MIN = 0.01;

// This needs to actually scale the vector here, but whatever :/
function calcMovement([prevX, prevY], [delta, target]) {
  const prevVec = new Vector2(prevX, prevY);
  const motionVec = new Vector2(...target);
  const distance = motionVec.distanceTo(prevVec);
  const distanceScale = R.clamp(0.01, 1, distance);

  motionVec.sub(prevVec);
  motionVec.normalize();
  motionVec.multiplyScalar(SPEED * delta * distanceScale);

  return distance > MOVE_DIST_MIN ? [prevX + motionVec.x, prevY + motionVec.y] : [prevX, prevY];
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
