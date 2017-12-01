import * as R from 'ramda';
import xs from 'xstream';

import generateLevel from './level/generator';

const level = generateLevel(0, 100);

function view(state) {
  return xs.of(level);
}

function LevelGenerator(sources) {
  const vdom$ = view({});

  return {
    DOM: vdom$,
  };
}

export default LevelGenerator;
