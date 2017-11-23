// Basically renders everthing that has to do with the actual game, so not menus
import * as R from 'ramda';
import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';
import Collection from '@cycle/collection';

import { aScene, aSky } from './utils/AframeHyperscript';
import generateLevel from './level/generator';
import Camera from './Camera';

import PlayerController from './PlayerController';
import PlayerObject from './PlayerObject';
import PlayerBullet from './PlayerBullet';

import EnemyObject from './EnemyObject';

const sky = aSky({ attrs: { color: '#f5f5f5' } });
const level = generateLevel(0, 100); // This ain't no cycle component, we should make it one

function intent(sources) {
  return {
    frame$: sources.Time.animationFrames(),
  };
}

function model(sources, actions) {
  const { DOM, Time } = sources;
  const { frame$ } = actions;

  const camera = Camera();
  const pController = PlayerController({ DOM, Time, frame$ });
  const player = PlayerObject({ DOM, frame$, move$: pController.move$ });

  // Bullet collection stuff
  const bulletSources = { DOM, startPos$: player.state$.take(1), frame$ };
  const pBullets$ = Collection(isolate(PlayerBullet), bulletSources, pController.shoot$, R.prop('remove$'));
  const bulletVdom$ = Collection.pluck(pBullets$, R.prop('DOM'));

  // Enemy Collection stuff
  // some bs start pos
  const enemySources = { DOM, startPos$: xs.of([0, 0]), frame$ };
  const enemy$ = Collection(isolate(EnemyObject), enemySources, xs.from([1, 2, 3]), R.prop('remove$'));
  const enemyVdom$ = Collection.pluck(enemy$, R.prop('DOM'));

  const children$ = xs.combine(camera.DOM, player.DOM, enemyVdom$, bulletVdom$).map(R.flatten);

  return {
    children$,
  };
}

function view(children$) {
  return children$
    .map(c =>
      section(
        '#game',
        [aScene([sky, ...c, ...level])]
      ));
}

function GameManager(sources) {
  const actions = intent(sources);
  const state = model(sources, actions);
  const vdom$ = view(state.children$);

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default GameManager;
