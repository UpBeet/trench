import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { aScene, aEntity, aSky } from './utils/AframeHyperscript';
import generateLevel from './level/generator';
import Camera from './Camera';
import PlayerController from './PlayerController';
import PlayerObject from './PlayerObject';

const sky = aSky({ attrs: { color: '#f5f5f5' } });
const level = generateLevel(0, 100); // This ain't no cycle component, we should make it one

function view(children$) {
  // Children stream should emit an array of children, but it don't now
  return children$
    .map(c =>
      section(
        '#game',
        [aScene([sky, ...c, ...level])]
      ));
}

function Trench(sources) {
  const { DOM } = sources;
  const camera = Camera();
  const pController = PlayerController(sources);
  const player = PlayerObject({ DOM, prop$: pController.move$ });

  const children$ = xs.combine(camera.DOM, player.DOM);
  const vdom$ = view(children$);

  const sinks = {
    DOM: xs.combine(vdom$, pController.move$).map(([x, _]) => x), // vdom$,
  };
  return sinks;
}

export default Trench;

// dafuq is this shit?
// level

// time,  -> levelObjects
// level
