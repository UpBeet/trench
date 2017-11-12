import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { aScene, aEntity, aSky } from './utils/AframeHyperscript';
import generateLevel from './level/generator';

const sky = aSky({ attrs: { color: '#f5f5f5' } });
const level = generateLevel(0, 100);

function Trench(sources) {
    const { DOM, storage } = sources;
    const vdom$ = xs.of(
        section(
            '#game', [aScene([sky, ...level])]
        )
    );

    const sinks = {
        DOM: vdom$,
    };
    return sinks;
}

export default Trench;

// level

// time,  -> levelObjects
// level

//
