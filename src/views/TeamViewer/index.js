import React from 'react';

import { capitalise } from 'ayaka/capitalise';
import Tabs from 'meiko/Tabs';
import SavedTeams from './SavedTeams';
import TrainerTeams from './TrainerTeams';

import { getUrlQueryStringAsObject } from 'utils/common';

import './TeamViewer.scss';

function TeamViewer({ match, location, history, ...props }) {
  function handleTabChange(name) {
    history.replace(`${match.url}?tab=${name}`);
  }

  const query = getUrlQueryStringAsObject(location);
  const activeTab = capitalise(query.tab || 'Saved');

  return (
    <Tabs.Container activeTab={activeTab} onChange={handleTabChange}>
      <Tabs.View name="Saved">
        {(isActive) => isActive && <SavedTeams {...props} />}
      </Tabs.View>
      <Tabs.View name="Trainer">
        {(isActive) => isActive && <TrainerTeams {...props} />}
      </Tabs.View>
    </Tabs.Container>
  );
}

export default TeamViewer;
