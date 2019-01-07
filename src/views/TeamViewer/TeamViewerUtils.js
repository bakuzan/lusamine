import Routes from 'constants/routes';

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

export function createTeamUrl(idString) {
  return `${Routes.base}/?team=${idString}`;
}
