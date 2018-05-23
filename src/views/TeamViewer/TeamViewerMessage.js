import React from 'react';

import { ButtonisedNavLink } from 'components/Buttons';
import Routes from 'constants/routes';

const TeamViewerMessage = () => (
  <div className="no-data-message">
    <div>You have no saved teams</div>
    <ButtonisedNavLink to={Routes.base}>Create a team</ButtonisedNavLink>
    <ButtonisedNavLink to={Routes.lusamineTeam}>
      Load an example team
    </ButtonisedNavLink>
  </div>
);

export default TeamViewerMessage;
