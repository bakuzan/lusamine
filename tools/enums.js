const Types = Object.freeze({
  normal: 1,
  grass: 2,
  fire: 3,
  water: 4,
  fighting: 5,
  flying: 6,
  poison: 7,
  ground: 8,
  rock: 9,
  bug: 10,
  ghost: 11,
  electric: 12,
  psychic: 13,
  ice: 14,
  dragon: 15,
  dark: 16,
  steel: 17,
  fairy: 18
});

const Regions = Object.freeze({
  alola: 7
});

const Evolutions = Object.freeze({
  leveling: 1,
  stone: 2,
  trade: 3
});

const TABLE_COUNT_OFFSET = 1;
const GENERATION_COUNT = 7;

module.exports = {
  Types,
  Evolutions,
  Regions,
  TABLE_COUNT_OFFSET,
  GENERATION_COUNT
};
