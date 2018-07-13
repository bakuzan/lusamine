import Strings from 'constants/strings';

export const BREAKDOWN_ITEM_CLASS = 'breakdown-panel__item';

const getScoreModifier = num =>
  !num
    ? Strings.scoreModifier.none
    : num < 3
      ? Strings.scoreModifier.low
      : num < 5
        ? Strings.scoreModifier.medium
        : Strings.scoreModifier.high;

export function getClassForScore(num) {
  const modifier = getScoreModifier(num);
  return `${BREAKDOWN_ITEM_CLASS}--${modifier}`;
}

export function getScoreDescription(mod, score) {
  const modifier = getScoreModifier(score);
  return `A good score is ${mod}. This score is ${modifier}`;
}
