import xs from 'xstream';
import { aEntity } from './utils/AframeHyperscript';

function view() {
  return xs.of(aEntity({ attrs: { camera: true } }));
}

function Camera() {
  const sinks = {
    DOM: view(),
  };

  return sinks;
}

export default Camera;
