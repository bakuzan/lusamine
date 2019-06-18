const fs = require('fs');
const path = require('path');

function writeOut(name, json) {
  const fileName = path.resolve(path.join(__dirname, `../output/${name}.json`));

  return new Promise((resolve) => {
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function(err) {
      if (err) {
        console.error(`Failed to write ${fileName}`, err);
        return resolve(false);
      }

      console.log(`Successfully written ${fileName}`);
      return resolve(true);
    });
  });
}

function cleanNumber(td) {
  return Number(
    td
      .text()
      .trim()
      .slice(1)
  );
}

async function baseHandler($, bodys, region) {
  const ids = {};

  const json = bodys.reduce((result, body) => {
    const rows = Array.from($('tr', body));

    const items = rows.map((tr, idx) => {
      if (idx === 0) {
        return null;
      }

      const tds = $('td', tr);
      const reg = tds.eq(0);
      const nat = tds.eq(1);

      if (!reg || !nat) {
        return null;
      }

      const nationalPokedexNumber = cleanNumber(nat);
      const formNumber = ids[nationalPokedexNumber];
      ids[nationalPokedexNumber] = ids[nationalPokedexNumber] + 1 || 1;

      return {
        region: region.number,
        code: region.code || null,
        regionalPokedexNumber: cleanNumber(reg),
        nationalPokedexNumber,
        formSuffix: formNumber ? `_${formNumber}` : ''
      };
    });

    return [...result, ...items];
  }, []);

  const data = json.filter((x) => !!x);
  return await writeOut(region.name, data);
}

async function islandHandler($, bodys, region) {
  const json = bodys.reduce((result, body) => {
    const rows = Array.from($('tr', body));

    const items = rows.map((tr, idx) => {
      if (idx === 0) {
        return null;
      }

      const tds = $('td', tr);
      const reg = tds.eq(0);
      const subs = [tds.eq(1), tds.eq(2), tds.eq(3), tds.eq(4)];
      const nat = tds.eq(5);

      if (!reg || !nat) {
        return null;
      }

      return {
        region: region.number,
        code: region.code || null,
        regionalPokedexNumber: cleanNumber(reg),
        nationalPokedexNumber: cleanNumber(nat),
        sublistings: subs.map((td) => ({ number: cleanNumber(td) || null }))
      };
    });

    return [...result, ...items];
  }, []);

  const data = json.filter((x) => !!x);
  return await writeOut(region.name, data);
}

module.exports = {
  baseHandler,
  islandHandler,
  writeOut
};
