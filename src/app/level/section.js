import { aEntity } from '../utils/AframeHyperscript';

const SECTION_LENGTH = 6;
const SECTION_WIDTH = 30;

const randColor = () => `#${Math.random().toString(16).substr(-6)}`;

const s1 = () => aEntity({
  attrs: {
    geometry: `primitive: box; width: 0.1; height: 20; depth: ${SECTION_LENGTH}`,
    material: `flatShading: true; color: ${randColor()}`,
    position: `${SECTION_WIDTH / 2} 1 0`,
  },
});

const s2 = () => aEntity({
  attrs: {
    geometry: `primitive: box; width: 0.1; height: 20; depth: ${SECTION_LENGTH}`,
    material: `flatShading: true; color: ${randColor()}`,
    position: `-${SECTION_WIDTH / 2} 1 0`,
  },
});

const s3 = () => aEntity({
  attrs: {
    geometry: `primitive: box; width: ${SECTION_WIDTH}; height: 0.1; depth:${SECTION_LENGTH}`,
    material: `flatShading: true; color: ${randColor()}`,
    position: '0 -9 0',
  },
});

// int, int => Entity
function generateSection(difficulty, offset = 0) {
  return aEntity({
    attrs: { position: `0 1.5 -${offset * SECTION_LENGTH}` },
  }, [s1(), s2(), s3()]);
}

export default generateSection;
