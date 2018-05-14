import {Types} from './enums';

const fixNPNStringToInt = (str = "") =>
  Number(str.replace(/\D/g, ""));

const processTdNPN = td =>
  fixNPNStringToInt(td.text() || "")

const processTdTypes = tds =>
  tds
  .reduce((types, td) => {
    if (!td || !td.children()) return types;
    const key = (td.children().first().text() || "").toLowerCase().trim();
    if (!key) return types;
    return [...types, Types[key]];
  }, []);

function mapElementsToPokemonJson(tdNPN, tdName, tdTypes) {
  return {
      nationalPokedexNumber: processTdNPN(tdNPN),
      name: tdName.children().first().text().toLowerCase(),
      typeIds: processTdTypes(tdTypes)
  }
}

function mapElementsToVariantPokemonJson(tdNPN, regionId, tdTypes) {
  return {
    nationalPokedexNumber: processTdNPN(tdNPN),
    regionId,
    typeIds: processTdTypes(tdTypes)
  }
}

function mapElementsToEvolutionJson() {
  
}

function mapElementsToMegaJson(tdData, tdTypes) {
  const aHref = tdData.children('a').attr('href');
  const nationalPokedexNumber = fixNPNStringToInt(aHref);
  const strMatch = aHref.match(/_\w./g);
  const suffix = strMatch
    ? strMatch[0].split("")[1].toLowerCase()
    : "";
  return {
    nationalPokedexNumber,
    suffix,
    typeIds: processTdTypes(tdTypes)
  }
}


export default {
  mapElementsToPokemonJson,
  mapElementsToVariantPokemonJson,
  mapElementsToMegaJson,
  mapElementsToEvolutionJson
}