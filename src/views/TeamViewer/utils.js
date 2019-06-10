import Routes from 'constants/routes';
import { generateUniqueId } from '../../utils/common';

export function createTeamUrl(idString) {
  return `${Routes.base}/?team=${idString}`;
}

export function mapSavedTeamsToDisplayModel(savedTeams) {
  return Object.keys(savedTeams).map((id) => {
    const { name, idString } = savedTeams[id];
    return {
      id,
      name,
      idString,
      memberIds: idString.split(',')
    };
  });
}

export function mapTrainerTeamsToDisplayModel(trainerTeams) {
  return trainerTeams.map((item) => ({
    id: generateUniqueId(),
    ...item,
    idString: item.memberIds.join(',')
  }));
}
