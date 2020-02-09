import { Types, Evolutions } from './enums';

const extractName = (td: Cheerio) =>
  td
    .children()
    .first()
    .text()
    .toLowerCase();

const fixNPNStringToInt = (str = '') => Number(str.replace(/\D/g, ''));

const processTdNPN = (td: Cheerio) => fixNPNStringToInt(td.text() || '');

function getNPNFromImg(td: Cheerio) {
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

const processTdTypes = (tds: Cheerio[]) =>
  tds.reduce<number[]>((types, td) => {
    if (!td || !td.children()) return types;
    const key = (
      td
        .children()
        .first()
        .text() || ''
    )
      .toLowerCase()
      .trim();

    if (!key) {
      return types;
    }

    return [...types, Types[key]];
  }, []);

function hasFactor(has: (s: string) => boolean) {
  return (
    (has('attack') && has('defense')) ||
    has('with remoraid') ||
    (has('cloak') && has('male,')) ||
    has('cascoon')
  );
}

function hasUnique(has: (s: string) => boolean) {
  return (
    has('level up with two hearts') ||
    has('maximum beautytrade') ||
    has('with dark-type in party') ||
    has('with 3ds held upside down') ||
    has('in rain or fog') ||
    has('free spaceadditional')
  );
}

function processEvolutionMechanism(howTxt: string) {
  const txt = howTxt.toLowerCase();
  function has(t: string) {
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

function mapElementsToPokemonJson(
  tdNPN: Cheerio,
  tdName: Cheerio,
  tdTypes: Cheerio[]
) {
  /* TODO
   * > Find a way to set the form...
   * > There doesn't seem to be a realiable one...
   */
  return {
    nationalPokedexNumber: processTdNPN(tdNPN),
    name: extractName(tdName),
    typeIds: processTdTypes(tdTypes),
    form: ''
  };
}

function mapElementsToVariantPokemonJson(
  tdNPN: Cheerio,
  regionId: number,
  tdTypes: Cheerio[]
) {
  return {
    nationalPokedexNumber: processTdNPN(tdNPN),
    regionId,
    typeIds: processTdTypes(tdTypes)
  };
}

function mapElementsToEvolutionJson(lastItem: any, rawData: any[]) {
  return rawData.map((r) => {
    const fromNPN = getNPNFromImg(r.from);
    const toNPN = getNPNFromImg(r.to);
    const how = r.how.text();

    return {
      nationalPokedexNumber: fromNPN || lastItem.nationalPokedexNumber,
      evolvesTo: toNPN,
      mechanism: processEvolutionMechanism(how),
      note: how.replace('→', '').trim()
    };
  });
}

function mapElementsToMegaJson(tdData: Cheerio, tdTypes: Cheerio[]) {
  const aHref = tdData.children('a').attr('href') ?? '';
  const nationalPokedexNumber = fixNPNStringToInt(aHref);
  const strMatch = aHref.match(/_\w./g);
  const suffix = strMatch ? strMatch[0].split('')[1].toLowerCase() : '';
  return {
    nationalPokedexNumber,
    suffix,
    typeIds: processTdTypes(tdTypes)
  };
}

export default {
  processTdNPN,
  mapElementsToPokemonJson,
  mapElementsToVariantPokemonJson,
  mapElementsToMegaJson,
  mapElementsToEvolutionJson
};
