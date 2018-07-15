const { Types, Evolutions } = require('./enums');

const extractName = td =>
  td
    .children()
    .first()
    .text()
    .toLowerCase();

const fixNPNStringToInt = (str = '') => Number(str.replace(/\D/g, ''));

const processTdNPN = td => fixNPNStringToInt(td.text() || '');

const getNPNFromImg = td => {
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
};

const processTdTypes = tds =>
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

const processEvolutionMechanism = howTd => {
  const str = howTd.text().toLowerCase();
  return str.includes('level')
    ? Evolutions.leveling
    : str.includes('trade')
      ? Evolutions.trade
      : Evolutions.stone;
};

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
  return rawData.map(r => {
    const fromNPN = getNPNFromImg(r.from);
    const toNPN = getNPNFromImg(r.to);

    return {
      nationalPokedexNumber: fromNPN,
      evolvesTo: toNPN,
      mechanism: processEvolutionMechanism(r.how)
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
