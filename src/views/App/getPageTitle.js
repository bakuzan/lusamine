import Strings from 'constants/strings';
import { capitaliseEachWord } from 'utils/common';

const TRAINER_TEAMS = 'trainer-teams';
const SAVED_TEAMS = 'saved-teams';
const SETTINGS = 'settings';
const POKEDEX = 'pokedex';

export default function getPageTitleForCurrentPath(path) {
  const key = path.includes(SAVED_TEAMS)
    ? 'savedTeams'
    : path.includes(TRAINER_TEAMS)
    ? 'trainerTeams'
    : path.includes(SETTINGS)
    ? 'settings'
    : path.includes(POKEDEX)
    ? 'pokedex'
    : 'planner';

  const pageHeader = capitaliseEachWord(Strings.pageTitle[key]);
  return {
    pageTitle: `Lusamine - ${pageHeader}`,
    pageHeader: pageHeader.replace('Pokémon ', ''),
    pageDescription: Strings.pageDescription[key]
  };
}
