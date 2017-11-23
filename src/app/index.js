import * as R from 'ramda';
import xs from 'xstream';
import { section } from '@cycle/dom';
import GameManager from './GameManager';

function view(children$) {
  // children still not an array
  return children$.map(c => section('#game', [c]));
}

function Trench(sources) {
  const { DOM, Time } = sources;

  const Game = GameManager(sources);
  const vdom$ = view(Game.DOM);

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default Trench;
