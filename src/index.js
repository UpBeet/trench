// Aframe setup
import 'aframe';
import run from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { timeDriver } from '@cycle/time';

import './aframe-addons';
// Main Component
import Trench from './app';

function makeDrivers() {
  const drivers = {
    DOM: makeDOMDriver('#root'),
    Time: timeDriver,
  };
  return drivers;
}

window.onload = () => run(Trench, makeDrivers());
