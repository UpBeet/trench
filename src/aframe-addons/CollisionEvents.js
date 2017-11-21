import AFRAME from 'aframe';
import { Vector3 } from 'three';
import * as R from 'ramda';

function checkAndEmitCollisions(source, target) {
  const sourceVec = new Vector3(
    source.position.data.x,
    source.position.data.y,
    source.position.data.z
  );
  const targetVec = new Vector3(
    target.position.data.x,
    target.position.data.y,
    target.position.data.z
  );
  const distance = sourceVec.distanceTo(targetVec);
  const collisionDistance = target['sphere-collision-target'].data.radius +
    target['sphere-collision-target'].data.radius;
  if (distance <= collisionDistance) {

    console.log('hit');
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
    tick(time, dt) {
      const targets = R.filter(
        t => t['sphere-collision-target'].data.targetType === this.data.targetType,
        R.map(
          R.prop('components'),
          document.querySelectorAll('[sphere-collision-target]')
        ),
      );

      targets.forEach(R.curry(checkAndEmitCollisions)(this.el.components));
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
