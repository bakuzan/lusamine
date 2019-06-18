export default function logData({ pokedex, regions, typeMatchups }) {
  console.groupCollapsed('App Data');
  console.log('%c pokedex', 'color: royalblue', pokedex);
  console.log('%c regions', 'color: firebrick', regions);
  console.log('%c types', 'color: forestgreen', typeMatchups);
  console.groupEnd();
}
