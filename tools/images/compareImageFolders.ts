import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdirAsync = promisify(fs.readdir);

function report(name: string, list: string[]) {
  console.log(`\n${name}:`);

  if (list.length) {
    list.forEach((s) => console.log(s));
  } else {
    console.log('None.');
  }
}

async function run() {
  const arts = await readdirAsync(path.join(__dirname, './art'));
  const sprites = await readdirAsync(path.join(__dirname, './sprites'));

  const artWithNoSprite = arts.filter((name) => !sprites.includes(name));
  const spritesWithNoArt = sprites.filter((name) => !arts.includes(name));

  report('Art with no sprite file', artWithNoSprite);
  report('Sprite with no art file', spritesWithNoArt);
}

run();
