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

// Create a new game manager every round? <- I don't like this so we will need a reset state
// If I did, we would need to contain all the important state stuff, in a stream in index
// Potential state$ stuff: Num Rounds/Score
// Should there be a separate component for each screen? Start, Level Won, Game, Lose?
// Do I set a cap on lvls? for github prototype yes
//
// To reset game I need to:
// - Reset player position, Reset enemies, Reset level Progress, Reset timer
