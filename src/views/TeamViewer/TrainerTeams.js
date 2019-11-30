import classNames from 'classnames';
import React, { useContext, useState } from 'react';

import { ButtonisedNavLink } from 'components/Buttons';
import Team from 'components/Team';
import { PokedexContext, TypeContext } from 'context';
import * as TVU from './utils';
import { selectMembersFromPokedexAllowDuplicates } from 'utils/common';
import { getTrainerTeams } from 'data';

function TrainerTeamViewer() {
  const { pokedex } = useContext(PokedexContext);
  const typeMatches = useContext(TypeContext);
  const [teams] = useState(
    TVU.mapTrainerTeamsToDisplayModel(getTrainerTeams())
  );

  return (
    <div className="team-viewer">
      {teams.map((t) => (
        <div key={t.id} className={classNames('team-viewer__team saved-team')}>
          <p id={`loadTeam_${t.id}`} className="for-screenreader-only">
            Click to open this team in the team creator where you can edit a new
            copy.
          </p>
          <div className="saved-team__inner">
            <div className={classNames('saved-team__actions')}>
              <ButtonisedNavLink
                to={TVU.createTeamUrl(t.idString)}
                link
                aria-describedby={`loadTeam_${t.id}`}
              >
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
        </div>
      ))}
    </div>
  );
}

export default TrainerTeamViewer;
