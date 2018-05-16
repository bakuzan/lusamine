const nsg = require('node-sprite-generator');
const imageGroup = 'art';
// const imageGroup = 'sprites';

nsg(
  {
    src: [`tools/images/${imageGroup}/*.png`],
    spritePath: `tools/images/_${imageGroup}.png`,
    stylesheetPath: `tools/images/_${imageGroup}.scss`
  },
  err => (err ? console.error(err) : console.log(`${imageGroup} generated!`))
);
