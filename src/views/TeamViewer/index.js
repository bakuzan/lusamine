import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { capitalise } from 'ayaka/capitalise';
import Tabs from 'meiko/Tabs';
import SavedTeams from './SavedTeams';
import TrainerTeams from './TrainerTeams';

import { getUrlQueryStringAsObject } from 'utils/common';

import './TeamViewer.scss';

function TeamViewer(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const query = getUrlQueryStringAsObject(location);
  const activeTab = capitalise(query.tab || 'Saved');

  function handleTabChange(name) {
    navigate(`${location.pathname}?tab=${name}`, { replace: true });
  }

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
