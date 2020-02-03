import {
  transformPokemonData,
  transformMegaPokemonData,
  transformVariantPokemonData,
  combineAndSortMaps
} from './transformers';

import pokemon from './raw/pokemon.json';
import megas from './raw/megaEvolutions.json';
import regionalVariants from './raw/regionalVariants.json';
import types from './raw/types.json';
import trainerTeams from './raw/trainerTeams.json';

import kanto from './raw/regionalPokedex/kanto.json';
import johto_og from './raw/regionalPokedex/new.json';
import johto from './raw/regionalPokedex/johto.json';
import hoenn from './raw/regionalPokedex/hoenn.json';
import hoenn_oras from './raw/regionalPokedex/hoenn_oras.json';
import sinnoh from './raw/regionalPokedex/sinnoh.json';
import sinnoh_pt from './raw/regionalPokedex/sinnoh_pt.json';
import unova from './raw/regionalPokedex/unova.json';
import unova_n from './raw/regionalPokedex/unova_n.json';
import kalos_ce from './raw/regionalPokedex/kalos_ce.json';
import kalos_co from './raw/regionalPokedex/kalos_co.json';
import kalos_mo from './raw/regionalPokedex/kalos_mo.json';
import alola from './raw/regionalPokedex/alola.json';
import alola_u from './raw/regionalPokedex/alola_u.json';
import galar from './raw/regionalPokedex/galar.json';

const SPRITES_PER_ROW = 30;
const ART_PER_ROW = 30;

export function constructPokedex() {
  const pokemonMap = transformPokemonData(pokemon);
  const megasMap = transformMegaPokemonData(megas);
  const variantsMap = transformVariantPokemonData(regionalVariants);

  const pokedex = combineAndSortMaps(
    ([id, mon], order) => {
      const sOffset = -40;
      const aOffset = -97;
      const sy = -2 + sOffset * Math.floor(order / SPRITES_PER_ROW);
      const sx = -1 + sOffset * (order % SPRITES_PER_ROW);
      const ay = 0 + aOffset * Math.floor((order + 1) / ART_PER_ROW);
      const ax = -1 + aOffset * ((order + 1) % ART_PER_ROW);

      return [
        id,
        {
          ...mon,
          spritePosition: { backgroundPosition: `${sx}px ${sy}px` },
          artPosition: { backgroundPosition: `${ax}px ${ay}px` }
        }
      ];
    },
    pokemonMap,
    megasMap,
    variantsMap
  );

  return {
    pokedex,
    regions: {
      kanto,
      new: johto_og,
      johto,
      hoenn,
      hoenn_oras,
      sinnoh,
      sinnoh_pt,
      unova,
      unova_n,
      kalos: [...kalos_ce, ...kalos_co, ...kalos_mo],
      alola,
      alola_u,
      galar
    }
  };
}

export function getTypeMatchups() {
  return types.reduce((p, c) => {
    p.set(c.id, c);
    return p;
  }, new Map());
}

export function getTrainerTeams() {
  return trainerTeams;
}
