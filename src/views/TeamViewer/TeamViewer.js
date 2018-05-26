import classNames from 'classnames';
import React from 'react';

import { ClearButton, ButtonisedNavLink } from 'components/Buttons';
import Team from 'components/Team/Team';
import TeamViewerMessage from 'views/TeamViewer/TeamViewerMessage';
import { PokedexContext } from 'context';
import * as TVU from './TeamViewerUtils';
import {
  getSavedTeams,
  replaceTeams,
  selectMembersFromPokedex
} from 'utils/common';

import './TeamViewer.css';

class TeamViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedTeams: false,
      savedTeams: null
    };

    this.handleDeleteTeam = this.handleDeleteTeam.bind(this);
  }

  componentDidMount() {
    this.setState({
      loadedTeams: true,
      savedTeams: getSavedTeams()
    });
  }

  handleDeleteTeam(teamId) {
    const { savedTeams } = this.state;
    const teams = Object.keys(savedTeams)
      .filter(k => k !== teamId)
      .reduce(
        (p, c) => ({
          ...p,
          [c]: savedTeams[c]
        }),
        {}
      );

    const updatedTeams = replaceTeams(teams);
    this.setState({ savedTeams: updatedTeams });
  }

  render() {
    const { savedTeams } = this.state;
    if (!this.state.loadedTeams) return null;
    if (this.state.loadedTeams && !savedTeams) return <TeamViewerMessage />;

    const teams = TVU.mapSavedTeamsToDisplayModel(savedTeams);

    console.log('render viewer > ', teams, savedTeams);
    return (
      <PokedexContext.Consumer>
        {pokedex => (
          <div className="team-viewer">
            {teams.map(t => (
              <div
                key={t.id}
                className={classNames('team-viewer__team saved-team')}
              >
                <div className={classNames('saved-team__actions')}>
                  <ButtonisedNavLink to={TVU.createTeamUrl(t.idString)}>
                    Load team
                  </ButtonisedNavLink>
                  <ClearButton
                    title="Delete"
                    onClick={() => this.handleDeleteTeam(t.id)}
                  />
                </div>
                <Team
                  members={selectMembersFromPokedex(pokedex, t.memberIds)}
                />
              </div>
            ))}
          </div>
        )}
      </PokedexContext.Consumer>
    );
  }
}

export default TeamViewer;