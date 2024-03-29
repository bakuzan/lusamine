export const Types = Object.freeze({
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

export const Regions = Object.freeze({
  alola: 7,
  galar: 8,
  hisui: 9
});

export const Evolutions = Object.freeze({
  leveling: 1,
  levelingHighFriendship: 2,
  levelingWithMove: 3,
  levelingAtLocation: 4,
  levelingAtTime: 5,
  levelingWithItem: 6,
  levelingGender: 7,
  levelingGame: 8,
  levelingUniqueCondition: 9,
  levelingAdditionalFactor: 10,
  stone: 11,
  stoneGender: 12,
  trade: 13,
  tradeWithItem: 14,
  tradeForPokemon: 15
});

export const TABLE_COUNT_OFFSET = 1;
export const GENERATION_COUNT = 9;

export enum ImageScrapeTarget {
  Art = 'art',
  Sprites = 'sprites'
}

export default {
  Types,
  Evolutions,
  Regions,
  TABLE_COUNT_OFFSET,
  GENERATION_COUNT
};
