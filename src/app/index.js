import * as R from 'ramda';
import xs from 'xstream';
import { section } from '@cycle/dom';
import GameManager from './GameManager';
import StartScreen from './StartScreen';

function view(children$) {
  // children still not an array
  return children$.map(c => section('#game', [c]));
}

function Trench(sources) {
  const { DOM, Time } = sources;

  const Start = StartScreen(sources);
  // Could pass in things like num enemies here and stuff
  // Need to set up a trigger for resetting the game
  // Could do a stream within a stream that creates these?
  const Game = GameManager(sources);
  const vdom$ = view(Game.DOM);

  const sinks = {
    DOM: vdom$,
  };
  return sinks;
}

export default Trench;

/**
 * Create a new game manager every round? <- I don't like this so we will need a reset state
 * If I did, we would need to contain all the important state stuff, in a stream in index
 * Potential state$ stuff: Num Rounds/Score
 * Should there be a separate component for each screen? Start, Level Won, Game, Lose?
 * Do I set a cap on lvls? for github prototype yes
 *
 * To reset game I need to:
 * - Reset player position, Reset enemies, Reset level Progress, Reset timer
 * - I need a way to pass reset trigger to components, and to manager
 * - Still need a way to track score
 *
 * How do I determine which screen is shown?
 * I could have one stream that picks one based on the state, and has all DOMs ready
 * ~~~ Should make sure that there is no wasted event stuff going on in the game manager
 *
 * I Really need to find a structure for all the files
 */
