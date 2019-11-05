import { capitaliseEachWord } from 'ayaka/capitalise';
import Strings from 'constants/strings';

const TEAMS = 'teams';
const SETTINGS = 'settings';
const POKEDEX = 'pokedex';
const STATISTICS = 'team-statistics';

export default function getPageTitleForCurrentPath(pathname, search) {
  const path = `${pathname}${search}`;

  let key = 'planner';

  if (path.includes(TEAMS)) {
    key = path.includes('Trainer') ? 'trainerTeams' : 'savedTeams';
  } else if (path.includes(SETTINGS)) {
    key = 'settings';
  } else if (path.includes(POKEDEX)) {
    key = 'pokedex';
  } else if (path.includes(STATISTICS)) {
    key = 'teamStatistics';
  }

  const pageHeader = capitaliseEachWord(Strings.pageTitle[key]);
  return {
    pageTitle: pageHeader,
    pageHeader: pageHeader.replace('Pokémon ', ''),
    pageDescription: Strings.pageDescription[key]
  };
}
