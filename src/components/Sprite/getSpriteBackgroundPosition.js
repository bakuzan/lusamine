function setPosition(x, y) {
  return { backgroundPosition: `${x}px ${y}px` };
}

function commonHandler(order, spritesPerRow) {
  const offset = -42;
  const y = -2 + offset * Math.floor(order / spritesPerRow);
  const x = -2 + offset * (order % spritesPerRow);
  return setPosition(x, y);
}

function handleNormalPosition(data) {
  return commonHandler(data.order, 29);
}
function handleMegaPosition(data) {
  return commonHandler(data.order, 6);
}
function handleVariantPosition(data) {
  const offset = -44;
  const y = -2;
  const x = -2 + offset * data.order;
  return setPosition(x, y);
}

export default function getBackgroundPosition(flags, data) {
  if (flags.isMega) {
    return handleMegaPosition(data);
  } else if (flags.isVariant) {
    return handleVariantPosition(data);
  } else {
    return handleNormalPosition(data);
  }
}
