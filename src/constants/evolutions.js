export default Object.freeze({
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

export const EvolutionForms = Object.freeze({
  notEvolved: 1,
  fullyEvolved: 2
});

const BURMY = 412;
const WORMDAM = 413;

const SHELLOS = 422;
const GASTRODON = 423;

export const evolvesToMatchedForm = [BURMY, WORMDAM, SHELLOS, GASTRODON];
