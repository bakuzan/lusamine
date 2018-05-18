import { generateEmptyPokemonId } from 'data/id-generators';
import Constants from 'constants/index';
const { Party, Generations, Strings } = Constants;

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
  const id = generateEmptyPokemonId();
  return [
    id,
    {
      id,
      nationalPokedexNumber: 0,
      name: 'empty',
      types: [],
      evolutions: [],
      generation: null,
      isEmpty: true
    }
  ];
}

export const generateEmptySlots = () => {
  const emptySlots = Array(Party.MAX_SIZE)
    .fill(null)
    .map(createEmptyPokemon);

  return new Map(emptySlots);
};

const checkPokemonId = check => mon => mon.id.startsWith(`${check}_`);

export const isMegaPokemon = checkPokemonId(Strings.idPrefix.mega);
export const isVariantPokemon = checkPokemonId(Strings.idPrefix.variant);
