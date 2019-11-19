export default function logData({ pokedex, regions, typeMatchups }) {
  const pokemon = Array.from(pokedex).map(([_, x]) => x);

  let forms = pokemon.filter((x) => !!x.form);
  const pkmWithForms = pokemon.filter((x) =>
    forms.some(
      (f) => f.nationalPokedexNumber === x.nationalPokedexNumber && !x.form
    )
  );

  forms = new Map(
    [...forms, ...pkmWithForms]
      .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
      .map((x) => [x.id, x])
  );

  console.groupCollapsed('App Data');
  console.log('%c pokedex', 'color: royalblue', pokedex);
  console.log('%c regions', 'color: firebrick', regions);
  console.log('%c   forms', 'color: purple', forms);
  console.log('%c   types', 'color: forestgreen', typeMatchups);
  console.groupEnd();
}
