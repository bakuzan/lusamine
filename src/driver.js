const clickOn = (selector) => () => {
  const el = document.getElementById(selector);
  if (!el) return console.warn(`${selector} not found.`);
  el.click();
};

export default {
  navigate: {
    planner: clickOn('planner'),
    savedTeams: clickOn('saved-teams'),
    settings: clickOn('settings')
  },
  planner: {
    randomise: clickOn('randomise-team'),
    save: clickOn('save-team'),
    clear: clickOn('clear-team'),
    toggleBreakdown: clickOn('toggle-breakdown')
  },
  settings: {
    toggleCanDnD: clickOn('can-dnd')
  }
};
