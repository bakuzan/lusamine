const nsg = require('node-sprite-generator');

nsg(
  {
    src: ['tools/images/*.png'],
    spritePath: 'tools/images/_art.png',
    stylesheetPath: 'tools/images/_art.scss',
    compositor: 'jimp'
  },
  err => (err ? console.error(err) : console.log('Sprite generated!'))
);
