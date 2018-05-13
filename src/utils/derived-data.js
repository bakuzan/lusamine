import { generateEmptyPokemonId } from 'data/id-generators';
import { MAX_PARTY_SIZE } from 'constants/misc';
import Generations from 'constants/generations';

const GEN2_START = 152;
const GEN3_START = 252;
const GEN4_START = 387;
const GEN5_START = 494;
const GEN6_START = 650;
const GEN7_START = 722;
export const getGeneration = dexNum => {
  if (dexNum < GEN2_START) return Generations.gen1;
  if (dexNum < GEN3_START) return Generations.gen2;
  if (dexNum < GEN4_START) return Generations.gen3;
  if (dexNum < GEN5_START) return Generations.gen4;
  if (dexNum < GEN6_START) return Generations.gen5;
  if (dexNum < GEN7_START) return Generations.gen6;
  return Generations.gen7;
};

function createEmptyPokemon() {
  return {
    id: generateEmptyPokemonId(),
    nationalPokedexNumber: 0,
    name: 'empty',
    types: [],
    evolutions: [],
    generation: null
  };
}

export const padPartyWithEmptySlots = party => {
  const emptyCount = MAX_PARTY_SIZE - party.length;
  const emptySlots = Array(emptyCount)
    .fill(null)
    .map(createEmptyPokemon);

  return [...party, ...emptySlots];
};
