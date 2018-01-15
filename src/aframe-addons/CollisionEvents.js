import AFRAME from 'aframe';
import { Vector3, Vector2 } from 'three';
import * as R from 'ramda';

// Game devs pool things bc we worry about memory
const sourceVec = new Vector3();
const targetVec = new Vector3();

// Could do a filter then do the for each to send and event to each collided element
// Could you help me clean this up brax?
function checkAndEmitCollisions(el, target) {
  const source = el.components;
  sourceVec.set(
    source.position.data.x,
    source.position.data.y,
    source.position.data.z
  );

  targetVec.set(
    target.position.data.x,
    target.position.data.y,
    target.position.data.z
  );

  const distance = sourceVec.distanceTo(targetVec);
  const collisionDistance = target['sphere-collision-target'].data.radius +
    target['sphere-collision-target'].data.radius;

  if (distance <= collisionDistance) {
    const evt = new CustomEvent('collide', { detail: 'sphere' });
    const evt2 = new CustomEvent('collide', { detail: 'sphere' });
    el.dispatchEvent(evt);
    target.position.el.dispatchEvent(evt2);
  }
}

AFRAME.registerComponent(
  'sphere-collision',
  {
    schema: {
      targetType: {
        type: 'string',
        default: '',
      },
      radius: {
        type: 'number',
        default: 1,
      },
    },

    tick() {
      const targets = R.filter(
        t => t['sphere-collision-target'].data.targetType === this.data.targetType,
        R.map(
          R.prop('components'),
          document.querySelectorAll('[sphere-collision-target]')
        ),
      );

      targets.forEach(R.curry(checkAndEmitCollisions)(this.el));
    },
  }
);

AFRAME.registerComponent(
  'sphere-collision-target',
  {
    schema: {
      radius: {
        default: 1,
      },
    },
  }
);
