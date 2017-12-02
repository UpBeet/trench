import { join, multiply } from 'ramda';
import xs from 'xstream';

import { aEntity } from './utils/AframeHyperscript';

const SECTION_LENGTH = 6;
const SECTION_WIDTH = 30;

const randColor = () => `#${Math.random().toString(16).substr(-6)}`;

function wallPiece(w, h, position, color) {
  const attrs = {
    geometry: `primitive: box; width: ${w}; height: ${h}; depth: ${SECTION_LENGTH}`,
    material: `flatShading: true; color: ${color}`,
    position,
  };

  return aEntity('.wall-piece', { attrs });
}

function model(actions) {
  const position$ = actions.position$
    .map(multiply(-SECTION_LENGTH))
    .map(x => `0 1.5 ${x}`);

  return {
    position$,
    remove$: xs.empty(),
  };
}

function view(state) {
  const color = randColor();
  const s1 = wallPiece(0.1, 20, `${SECTION_WIDTH / 2} 1 0`, color);
  const s2 = wallPiece(0.1, 20, `-${SECTION_WIDTH / 2} 1 0`, color);
  const s3 = wallPiece(SECTION_WIDTH, 0.1, '0 -9 0', color);

  return state.position$
    .map(position => aEntity('.level-section', { attrs: { position } }, [s1, s2, s3]));
}

// int, int => Entity
function Section(sources) {
  const state = model(sources);
  const vdom$ = view(state);

  return {
    DOM: vdom$,
    remove$: state.remove$,
  };
}

export default Section;