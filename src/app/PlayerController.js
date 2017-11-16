import * as R from 'ramda';
import xs from 'xstream';

const X_MAX = window.innerWidth / 2;
const Y_MAX = window.innerHeight / 2;

function scaleCoords([x, y]) {
  return [
    (x - X_MAX) / X_MAX,
    (y - Y_MAX) / Y_MAX,
  ];
}

function Controller(sources) {
  const { DOM } = sources;
  const move$ = DOM.select('#root')
    .events('mousemove')
    .map(R.props(['clientX', 'clientY']))
    .map(scaleCoords)
    .startWith([0, 0]);

  const sinks = {
    move$,
  };
  return sinks;
}

export default Controller;
