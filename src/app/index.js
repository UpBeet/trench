import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { aScene, aEntity, aSky } from './utils/AframeHyperscript';

const sky = aSky({ attrs: { color: '#f5f5f5' } });
const sphere = aEntity(
    {
      attrs: {
        geometry: 'primitive: sphere; radius: 0.05; segmentsWidth: 10; segmentsHeight: 10;',
        material: 'flatShading: true; color: "#000000"',
        position: '0 1.5 -1',
      },
    }
  );

function Trench(sources) {
    const { DOM, storage } = sources;
    const vdom$ = xs.of(
        section(
            '#game', [aScene([sky, sphere])]
        )
    );
    
    const sinks = {
        DOM: vdom$,
    };
    return sinks;
}

export default Trench;