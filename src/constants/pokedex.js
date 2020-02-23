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
  galar: 'galar'
});

export const pokedexOptions = Object.keys(Pokedex).map((k) => ({
  value: k,
  text: capitaliseEachWord(Pokedex[k])
}));
