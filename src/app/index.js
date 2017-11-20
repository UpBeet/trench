import * as R from 'ramda';
import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';
import Collection from '@cycle/collection';

import { aScene, aEntity, aSky } from './utils/AframeHyperscript';
import generateLevel from './level/generator';
import Camera from './Camera';
import PlayerController from './PlayerController';
import PlayerObject from './PlayerObject';
import PlayerBullet from './PlayerBullet';

const sky = aSky({ attrs: { color: '#f5f5f5' } });
const level = generateLevel(0, 100); // This ain't no cycle component, we should make it one

function intent(sources) {
  return {
    frame$: sources.Time.animationFrames(),
  };
}

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
  const { DOM, Time } = sources;
  const { frame$ } = intent(sources);

  const camera = Camera();
  const pController = PlayerController({ DOM, Time, frame$ });
  const player = PlayerObject({ DOM, frame$, move$: pController.move$ });

  const bulletProps = { startPos$: player.state$.take(1), frame$ };
  const pBullets$ = Collection(PlayerBullet, bulletProps, pController.shoot$, R.prop('remove$'));
  const bulletVdom$ = Collection.pluck(pBullets$, R.prop('DOM'));

  const children$ = xs.combine(camera.DOM, player.DOM, bulletVdom$).map(R.flatten);
  const vdom$ = view(children$);

  const sinks = {
    DOM: xs.combine(vdom$, pController.move$).map(([x]) => x), // vdom$,
  };
  return sinks;
}

export default Trench;

// dafuq is this shit?
// level

// time,  -> levelObjects
// level
