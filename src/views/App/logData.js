export default function logData({ pokedex, typeMatchups }) {
  console.groupCollapsed('App Data');
  console.log('%c pokedex', 'color: royalblue', pokedex);
  console.log('%c types', 'color: forestgreen', typeMatchups);
  console.groupEnd();
}
