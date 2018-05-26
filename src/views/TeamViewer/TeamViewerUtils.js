import Routes from 'constants/routes';

export function mapSavedTeamsToDisplayModel(savedTeams) {
  return Object.keys(savedTeams).map(id => {
    const idString = savedTeams[id];
    return {
      id,
      idString,
      memberIds: idString.split(',')
    };
  });
}

export function createTeamUrl(idString) {
  return `${Routes.base}/?team=${idString}`;
}
