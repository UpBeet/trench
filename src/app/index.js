import xs from 'xstream';
import { section } from '@cycle/dom';
import isolate from '@cycle/isolate';

function Trench(sources) {
    const { DOM, storage } = sources;
    const vdom$ = xs.of(section('#game', 'Peter <3 Brax'));
    
    const sinks = {
        DOM: vdom$,
    };
    return sinks;
}

export default Trench;