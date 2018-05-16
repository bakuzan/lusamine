const fs = require('fs');
const request = require('request');

function downloadImage(options) {
  const { url, outputFile } = options;
  const fileName = `./tools/images/${outputFile}`;

  request.get({ url, encoding: 'binary' }, function(error, response, data) {
    if (error) return console.error(`Failed to request ${url}`, error);

    fs.writeFile(fileName, data, 'binary', err => {
      if (err) return console.error(`Failed to write ${fileName}`, err);
      return console.log(`Successfully written ${fileName}`);
    });
  });
}

const padInt = i => `${i}`.padStart(3, '0');

// Art:
// [...Array(807).keys()]
// .map(x => ++x)
// .forEach(i => {
//   const paddedInt = padInt(i);
//   downloadImage({
//     url: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedInt}.png`,
//     outputFile: `art/${paddedInt}.png`
//   })
// });

// Sprites:
