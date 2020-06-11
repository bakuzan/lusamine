import { capitaliseEachWord } from 'ayaka/capitalise';
import Strings from 'constants/strings';

export const RouteKeyWords = {
  TEAMS: 'teams',
  SETTINGS: 'settings',
  POKEDEX: 'pokedex',
  STATISTICS: 'team-statistics'
};

export default function getPageTitleForCurrentPath(pathname, search) {
  const path = `${pathname}${search}`;

  let key = 'planner';

  if (path.includes(RouteKeyWords.TEAMS)) {
    key = path.includes('Trainer') ? 'trainerTeams' : 'savedTeams';
  } else if (path.includes(RouteKeyWords.SETTINGS)) {
    key = 'settings';
  } else if (path.includes(RouteKeyWords.POKEDEX)) {
    key = 'pokedex';
  } else if (path.includes(RouteKeyWords.STATISTICS)) {
    key = 'teamStatistics';
  }

  const pageHeader = capitaliseEachWord(Strings.pageTitle[key]);
  return {
    pageTitle: pageHeader,
    pageHeader: pageHeader.replace('Pokémon ', ''),
    pageDescription: Strings.pageDescription[key]
  };
}
