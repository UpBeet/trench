import makeSection from './section';

// int, int => [Entity]
export default function generateLevel(difficulty = 0, length = 10) {
  return [...Array(length).keys()]
    .map(i => makeSection(difficulty, i));
}
