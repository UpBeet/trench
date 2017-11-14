import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { aScene, aEntity, aSky } from './utils/AframeHyperscript';
import generateLevel from './level/generator';
import Camera from './Camera';

const sky = aSky({ attrs: { color: '#f5f5f5' } });
const level = generateLevel(0, 100); // This ain't no cycle component, we should make it one

function view(children$) {
  // Children stream should emit an array of children, but it don't now
  return children$
    .map(c =>
      section(
        '#game',
        [aScene([sky, c, ...level])]
      ));
}

function Trench(sources) {
  const { DOM } = sources;
  const camera = Camera();
  const vdom$ = view(camera.DOM);

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default Trench;

// dafuq is this shit?
// level

// time,  -> levelObjects
// level
