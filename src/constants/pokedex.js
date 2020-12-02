import { capitaliseEachWord } from 'ayaka/capitalise';

export const Pokedex = Object.freeze({
  national: 'national',
  kanto: 'kanto',
  new: 'new',
  johto: 'johto',
  hoenn: 'hoenn',
  hoenn_oras: 'hoenn ORAS',
  sinnoh: 'sinnoh',
  sinnoh_pt: 'sinnoh platinum',
  unova: 'unova',
  unova_n: 'unova new',
  kalos: 'kalos',
  alola: 'alola',
  alola_u: 'alola ultra',
  galar: 'galar',
  galar_isle_of_armor: 'galar isle of armor',
  galar_crown_tundra: 'galar crown tundra'
});

function capitaliseEachWordOver2Characters(str) {
  return capitaliseEachWord(str)
    .split(' ')
    .map((x) => (x.length < 3 ? x.toLowerCase() : x))
    .join(' ');
}

export const pokedexOptions = Object.keys(Pokedex).map((k) => ({
  value: k,
  text: capitaliseEachWordOver2Characters(Pokedex[k])
}));
