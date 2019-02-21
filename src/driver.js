function getElement(selector) {
  const el = document.getElementById(selector);
  if (!el) {
    console.warn(`${selector} not found.`);
  }

  return el;
}

const clickOn = (selector) => () => {
  const el = getElement(selector);
  el && el.click();
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
    toggleBreakdown: clickOn('toggle-breakdown'),
    add: (id) => clickOn(`sprite-${id}`)(),
    remove: (id) => {
      const baseUrl = `${window.location.origin}${window.location.pathname}`;
      const newSearch = window.location.search
        .replace(id, '')
        .replace(',,', ',')
        .replace('=,', '=');

      window.location.href = `${baseUrl}${newSearch}`;
    }
  },
  settings: {
    toggleCanDnD: clickOn('can-dnd')
  }
};
