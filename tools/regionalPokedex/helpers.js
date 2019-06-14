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

      return {
        region: region.number,
        code: region.code || null,
        regionalPokedexNumber: cleanNumber(reg),
        nationalPokedexNumber: cleanNumber(nat)
      };
    });

    return [...result, ...items];
  }, []);

  const data = json.filter((x) => !!x);
  return await writeOut(region.name, data);
}

module.exports = {
  baseHandler,
  writeOut
};
