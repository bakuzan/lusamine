const fs = require('fs');
const art = require('./art');
const sprites = require('./sprites');

const basePath = './tools/name-manipulation/output';

const MEGA = '-mega';
const ALOLA = '-alola';
function formatName(str) {
  let result;
  if (str.includes(MEGA)) {
    result = `mega-${str.replace(MEGA, '')}`;
  } else if (str.includes(ALOLA)) {
    result = `alola-${str.replace(ALOLA, '')}`;
  } else {
    result = str;
  }
  return result;
}

function prep(obj) {
  return Object.keys(obj).map(name => ({
    name: formatName(name),
    values: obj[name]
  }));
}

const sorter = (a, b) => {
  const { x: ax, y: ay } = a.values;
  const { x: bx, y: by } = b.values;
  if (ay > by) return -1;
  if (ay < by) return 1;

  if (ax > bx) return -1;
  if (ax < bx) return 1;
  return 0;
};

function nameOnly(p, c, i) {
  const join = i !== 0 ? ',\n' : '';
  return `${p}${join}${c.name}`;
}

const aMons = prep(art);
const sMons = prep(sprites);

const aSorted = aMons.sort(sorter).reduce(nameOnly, '');
const sSorted = sMons.sort(sorter).reduce(nameOnly, '');

fs.writeFile(`${basePath}/art.txt`, aSorted, err =>
  console.log('Done?: ', !err)
);
fs.writeFile(`${basePath}/sprites.txt`, sSorted, err =>
  console.log('Done?: ', !err)
);
