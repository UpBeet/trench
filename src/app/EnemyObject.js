import * as R from 'ramda';
import xs from 'xstream';

import { aEntity, aAnimation } from './utils/AframeHyperscript';

function intent(sources) {
  const { DOM, startPos$ } = sources;
  const collide$ = DOM.select('.enemy').events('collide');
  const endAnimation$ = DOM.select('.enemy').select('.e-animation').events('animationend');

  return {
    collide$,
    startPos$,
    endAnimation$,
  };
}

function model(actions) {
  const { collide$, startPos$, endAnimation$ } = actions;

  /**
   * temp rando position bs until we figure out how to move em
   * Position should be based on how many are left in the array total
   * Does each enemy need to know it's index? Could have the z based on the index,
   * or I could have them randomly distributed within a range and each time one is removed
   * everything moves a little closer to the player, This could be done exclusively in an
   * enemy manager
   *
   * I vote for enemy manager
   */
  const x = 0.025 - (0.05 * Math.random());
  const y = 0.025 - (0.05 * Math.random());
  const position$ = startPos$.map(() => [x, y, -0.5]);
  const remove$ = endAnimation$;
  const isDead$ = collide$
    .mapTo(true)
    .startWith(false);

  return {
    position$,
    remove$,
    isDead$,
  };
}

function view(state) {
  const { position$, isDead$ } = state;
  return xs.combine(position$, isDead$)
    .map(([[x, y, z], isDead]) => {
      const shapeAttrs = {
        geometry: 'primitive: sphere; radius: 0.01; segmentsWidth: 10; segmentsHeight: 10;',
        material: 'flatShading: true; color: green',
        position: `${x} ${y} ${z}`,
        'sphere-collision-target': 'targetType: enemy; radius: 0.01',
      };


      const aAttrs = {
        attribute: 'scale',
        to: '0.5 0.5 0.5',
        duration: '1000',
      };

      const children = [
        isDead ? aAnimation('.e-animation', { attrs: aAttrs }) : '',
      ];
      return aEntity('.enemy', { attrs: shapeAttrs }, children);
    });
}

function EnemyObject(sources) {
  const actions = intent(sources);
  const state = model(actions);
  const vdom$ = view(state);

  const sinks = {
    DOM: vdom$,
    remove$: state.remove$,
  };
  return sinks;
}

export default EnemyObject;
