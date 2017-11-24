import * as R from 'ramda';
import xs from 'xstream';
import { button } from '@cycle/dom';

function intent(sources) {
  const { DOM } = sources;
  const click$ = DOM.select('.start').events('click');

  return {
    click$,
  };
}

function model(actions) {
  const { click$ } = actions;

  const begin$ = click$.mapTo(true).startWith(false);

  return {
    begin$,
  };
}

function view() {
  // children still not an array
  return xs.of(button('.start', 'BEGIN'));
}

function StartScreen(sources) {
  const actions = intent(sources);
  const state = model(actions);
  const vdom$ = view();

  const sinks = {
    DOM: vdom$,
    state$: state.begin$,
  };
  return sinks;
}

export default StartScreen;
