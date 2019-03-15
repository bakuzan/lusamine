import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import { ButtonisedNavLink } from 'components/Buttons';
import Team from 'components/Team';
import { PokedexContext, TypeContext } from 'context';
import * as TVU from './TeamViewerUtils';
import { selectMembersFromPokedexAllowDuplicates } from 'utils/common';
import { getTrainerTeams } from 'data';

import './TeamViewer.scss';

function TrainerTeamViewer() {
  const pokedex = useContext(PokedexContext);
  const typeMatches = useContext(TypeContext);
  const [teams] = useState(
    TVU.mapTrainerTeamsToDisplayModel(getTrainerTeams())
  );
  console.groupCollapsed('DevOnly! Trainer Teams');
  console.log(
    '%c teams',
    'color: magenta',
    teams.map((x) => ({
      ...x,
      members: x.memberIds.map((id) => pokedex.get(id))
    }))
  );
  console.groupEnd();
  return (
    <div className="team-viewer">
      {teams.map((t) => (
        <div key={t.id} className={classNames('team-viewer__team saved-team')}>
          <div className={classNames('saved-team__actions')}>
            <ButtonisedNavLink to={TVU.createTeamUrl(t.idString)}>
              Load team
            </ButtonisedNavLink>
          </div>
          <Team
            name={t.name}
            types={typeMatches}
            members={selectMembersFromPokedexAllowDuplicates(
              pokedex,
              t.memberIds
            )}
          />
        </div>
      ))}
    </div>
  );
}

export default TrainerTeamViewer;
