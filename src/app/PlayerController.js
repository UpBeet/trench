import * as R from 'ramda';
import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

import createKeyPress from './utils/CreateKeyPress';

const X_MAX = window.innerWidth / 2;
const Y_MAX = window.innerHeight / 2;

/** Scale Coords from screen pos to world pos */
function scaleCoords([x, y]) {
  return [
    (x - X_MAX) / X_MAX,
    (y - Y_MAX) / Y_MAX,
  ];
}

function intent(sources) {
  const { DOM, frame$ } = sources;

  const mouseMove$ = DOM.select('#root').events('mousemove');
  // Maybe this should be passed from index?
  const keyUp$ = DOM.select('body').events('keyup');
  const keyDown$ = DOM.select('body').events('keydown');

  return {
    mouseMove$,
    keyUp$,
    keyDown$,
    frame$,
  };
}

function Controller(sources) {
  const {
    mouseMove$, keyUp$, keyDown$, frame$,
  } = intent(sources);

  const move$ = mouseMove$
    .map(R.props(['clientX', 'clientY']))
    .map(scaleCoords)
    .startWith([0, 0]);

  const spaceKey$ = createKeyPress(' ', keyDown$, keyUp$); // should be in intents
  const shoot$ = frame$.compose(sampleCombine(spaceKey$)) // find sample pls
    .filter(([_, pressed]) => pressed)
    .compose(sources.Time.throttle(200))
    .mapTo('fire!');

  // should this be a singular state?
  const sinks = {
    move$,
    shoot$,
  };
  return sinks;
}

export default Controller;
