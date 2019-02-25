import art from 'assets/art.webp';
import sprites from 'assets/sprites.webp';
import types from 'assets/types.webp';

function preload(url) {
  const img = new Image();
  img.src = url;
}

export default function preloadImages() {
  [art, sprites, types].forEach(preload);
}
