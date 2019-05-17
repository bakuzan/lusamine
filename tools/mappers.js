const { Types, Evolutions } = require('./enums');

const extractName = (td) =>
  td
    .children()
    .first()
    .text()
    .toLowerCase();

const fixNPNStringToInt = (str = '') => Number(str.replace(/\D/g, ''));

const processTdNPN = (td) => fixNPNStringToInt(td.text() || '');

function getNPNFromImg(td) {
  const el = td
    .children()
    .first()
    .children()
    .first();
  const src = el.attr('src');
  if (!src) {
    return Number(0);
  }
  const strNum = src.replace(/^.*\/|\D/g, '');
  return Number(strNum);
}

const processTdTypes = (tds) =>
  tds.reduce((types, td) => {
    if (!td || !td.children()) return types;
    const key = (
      td
        .children()
        .first()
        .text() || ''
    )
      .toLowerCase()
      .trim();
    if (!key) return types;
    return [...types, Types[key]];
  }, []);

function hasFactor(has) {
  return (
    (has('attack') && has('defense')) ||
    has('with remoraid') ||
    (has('cloak') && has('male,')) ||
    has('cascoon')
  );
}

function hasUnique(has) {
  return (
    has('level up with two hearts') ||
    has('maximum beautytrade') ||
    has('with dark-type in party') ||
    has('with 3ds held upside down') ||
    has('in rain or fog') ||
    has('free spaceadditional')
  );
}

function processEvolutionMechanism(howTxt) {
  const txt = howTxt.toLowerCase();
  function has(t) {
    return txt.includes(t);
  }

  if (has('friendship') && !(has('(night)') || has('(day)'))) {
    return Evolutions.levelingHighFriendship;
  } else if (has('level up knowing')) {
    return Evolutions.levelingWithMove;
  } else if (
    has('level up near') ||
    has('level up in a') ||
    has('level up at')
  ) {
    return Evolutions.levelingAtLocation;
  } else if (has('(night)') || has('(day)') || has('(between')) {
    return Evolutions.levelingAtTime;
  } else if (has('level up holding')) {
    return Evolutions.levelingWithItem;
  } else if (has('level') && has('male)')) {
    return Evolutions.levelingGender;
  } else if (has('400 meltan candy') || (has('level') && has('(pokémon '))) {
    return Evolutions.levelingGame;
  } else if (hasUnique(has)) {
    return Evolutions.levelingUniqueCondition;
  } else if (hasFactor(has)) {
    return Evolutions.levelingAdditionalFactor;
  } else if (has('stone') && !has('male)')) {
    return Evolutions.stone;
  } else if (has('stone') && has('male)')) {
    return Evolutions.stoneGender;
  } else if (has('trade') && !has('holding') && !has('for')) {
    return Evolutions.trade;
  } else if (has('trade holding')) {
    return Evolutions.tradeWithItem;
  } else if (has('trade for')) {
    return Evolutions.tradeForPokemon;
  } else {
    return Evolutions.leveling;
  }
}

function mapElementsToPokemonJson(tdNPN, tdName, tdTypes) {
  return {
    nationalPokedexNumber: processTdNPN(tdNPN),
    name: extractName(tdName),
    typeIds: processTdTypes(tdTypes)
  };
}

function mapElementsToVariantPokemonJson(tdNPN, regionId, tdTypes) {
  return {
    nationalPokedexNumber: processTdNPN(tdNPN),
    regionId,
    typeIds: processTdTypes(tdTypes)
  };
}

function mapElementsToEvolutionJson(rawData) {
  return rawData.map((r) => {
    const fromNPN = getNPNFromImg(r.from);
    const toNPN = getNPNFromImg(r.to);
    const how = r.how.text();
    return {
      nationalPokedexNumber: fromNPN,
      evolvesTo: toNPN,
      mechanism: processEvolutionMechanism(how),
      note: how
    };
  });
}

function mapElementsToMegaJson(tdData, tdTypes) {
  const aHref = tdData.children('a').attr('href');
  const nationalPokedexNumber = fixNPNStringToInt(aHref);
  const strMatch = aHref.match(/_\w./g);
  const suffix = strMatch ? strMatch[0].split('')[1].toLowerCase() : '';
  return {
    nationalPokedexNumber,
    suffix,
    typeIds: processTdTypes(tdTypes)
  };
}

module.exports = {
  mapElementsToPokemonJson,
  mapElementsToVariantPokemonJson,
  mapElementsToMegaJson,
  mapElementsToEvolutionJson
};