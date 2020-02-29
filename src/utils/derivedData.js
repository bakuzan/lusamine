import { generateEmptyPokemonId } from 'data/idGenerators';
import Constants from 'constants/index';
const { Party, Generations, Strings } = Constants;

const GEN2_START = 152;
const GEN3_START = 252;
const GEN4_START = 387;
const GEN5_START = 494;
const GEN6_START = 650;
const GEN7_START = 722;
const GEN8_START = 810;
export function getGeneration(dexNum) {
  if (dexNum < GEN2_START) return Generations.gen1;
  if (dexNum < GEN3_START) return Generations.gen2;
  if (dexNum < GEN4_START) return Generations.gen3;
  if (dexNum < GEN5_START) return Generations.gen4;
  if (dexNum < GEN6_START) return Generations.gen5;
  if (dexNum < GEN7_START) return Generations.gen6;
  if (dexNum < GEN8_START) return Generations.gen7;
  return Generations.gen8;
}

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

const checkPokemonId = (check) => (mon) => mon.id.startsWith(`${check}_`);

export const isEmptyPokemon = (mon) => mon.nationalPokedexNumber === 0;
export const isMegaPokemon = checkPokemonId(Strings.idPrefix.mega);
export const isVariantPokemon = checkPokemonId(Strings.idPrefix.variant);
export const isAltFormPokemon = (mon) =>
  mon.id.split('_').length === 3 && !isVariantPokemon(mon);

const isTrainerTeamMember = (mon) => mon.id.includes('-d');

export function isNotBasePokemon(mon) {
  return (
    isMegaPokemon(mon) ||
    isVariantPokemon(mon) ||
    isAltFormPokemon(mon) ||
    isTrainerTeamMember(mon)
  );
}

export const isBasePokemon = (mon) => !isNotBasePokemon(mon);

const getIdParts = (id) => id.split('_').slice(2);

export function isVariantRegionMatch(p1, p2) {
  const [r1, f1] = getIdParts(p1.id);
  const [r2, f2] = getIdParts(p2.id);

  return isVariantPokemon(p1) && isVariantPokemon(p2) && r1 === r2 && f1 === f2;
}
