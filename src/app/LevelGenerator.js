import { prop, range } from 'ramda';
import xs from 'xstream';
import Collection from '@cycle/collection';
import isolate from '@cycle/isolate';

import Section from './LevelSection';
import { aEntity } from './utils/AframeHyperscript';

function view(state) {
  return state.sectionDom$.map(s => aEntity('.level', {}, s));
}

function LevelGenerator(sources) {
  const addSection$ = xs.from(range(0, 100))
    .map(p => ({ position$: xs.of(p) }));
  const section$ = Collection(isolate(Section), {}, addSection$, prop('remove$'));
  const sectionDom$ = Collection.pluck(section$, prop('DOM'));
  const vdom$ = view({ sectionDom$ });

  return {
    DOM: vdom$,
  };
}

export default LevelGenerator;
