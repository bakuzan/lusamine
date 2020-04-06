import classNames from 'classnames';
import React from 'react';

import {
  ClearButton,
  ButtonisedNavLink,
  UpButton,
  DownButton
} from 'components/Buttons';
import Team from 'components/Team';
import TeamViewerMessage from 'components/TeamViewerMessage';
import { PokedexContext, TypeContext } from 'context';
import Routes from 'constants/routes';
import Orders from 'constants/orders';
import * as TVU from './utils';
import {
  teamsStore,
  selectMembersFromPokedex,
  moveToNewArrayPosition
} from 'utils/common';

class TeamViewer extends React.Component {
  static contextType = PokedexContext;

  constructor(props) {
    super(props);
    this.state = {
      loadedTeams: false,
      savedTeams: null
    };

    this.handleDeleteTeam = this.handleDeleteTeam.bind(this);
    this.handleMoveTeam = this.handleMoveTeam.bind(this);
  }

  componentDidMount() {
    this.setState({
      loadedTeams: true,
      savedTeams: teamsStore.get()
    });
  }

  handleDeleteTeam(teamId) {
    const { savedTeams } = this.state;
    const teams = Object.keys(savedTeams)
      .filter((k) => k !== teamId)
      .reduce(
        (p, c) => ({
          ...p,
          [c]: savedTeams[c]
        }),
        {}
      );

    const updatedTeams = teamsStore.replace(teams);
    this.setState({ savedTeams: updatedTeams });
  }

  handleMoveTeam(teamId, direction) {
    const { savedTeams } = this.state;

    const teamKeys = Object.keys(savedTeams);
    const teamIndex = teamKeys.findIndex((x) => x === teamId);
    const newIndex = teamIndex + direction;

    const teams = moveToNewArrayPosition(teamKeys, teamIndex, newIndex).reduce(
      (p, c) => ({
        ...p,
        [c]: savedTeams[c]
      }),
      {}
    );

    const updatedTeams = teamsStore.replace(teams);
    this.setState({ savedTeams: updatedTeams });
  }

  render() {
    let { pokedex } = this.context;
    const { savedTeams } = this.state;

    if (!this.state.loadedTeams) {
      return null;
    }

    if (!savedTeams || Object.keys(savedTeams).length === 0) {
      return <TeamViewerMessage />;
    }

    const teams = TVU.mapSavedTeamsToDisplayModel(savedTeams);
    const teamCount = teams.length;
    const showTeamStatisticsLink = teamCount > 2;
    const canReOrder = teamCount > 1;

    return (
      <TypeContext.Consumer>
        {(typeMatches) => (
          <div className="team-viewer">
            {showTeamStatisticsLink && (
              <div className="team-viewer__navigation">
                <ButtonisedNavLink
                  to={`${Routes.base}${Routes.teamStatistics}`}
                  link
                >
                  See team statistics
                </ButtonisedNavLink>
              </div>
            )}
            {teams.map((t, i) => {
              const isFirst = i === 0;
              const isLast = i === teamCount - 1;

              return (
                <div
                  key={t.id}
                  className={classNames('team-viewer__team saved-team')}
                >
                  <p id={`loadTeam_${t.id}`} className="for-screenreader-only">
                    Click to open this team in the team creator where you can
                    edit a new copy.
                  </p>
                  <div className="team-viewer__controls">
                    {canReOrder && (
                      <UpButton
                        className="saved-team__action"
                        disabled={isFirst}
                        onClick={() => this.handleMoveTeam(t.id, Orders.moveUp)}
                      />
                    )}
                    {canReOrder && (
                      <DownButton
                        className="saved-team__action"
                        disabled={isLast}
                        onClick={() =>
                          this.handleMoveTeam(t.id, Orders.moveDown)
                        }
                      />
                    )}
                  </div>
                  <div className="saved-team__inner">
                    <div className={classNames('saved-team__actions')}>
                      <ButtonisedNavLink
                        to={TVU.createTeamUrl(t.idString)}
                        link
                        aria-describedby={`loadTeam_${t.id}`}
                      >
                        Load team
                      </ButtonisedNavLink>
                      <ClearButton
                        title="Delete Team"
                        aria-label="Delete Team"
                        onClick={() => this.handleDeleteTeam(t.id)}
                      />
                    </div>
                    <Team
                      id={t.id}
                      name={t.name}
                      types={typeMatches}
                      members={selectMembersFromPokedex(pokedex, t.memberIds)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TypeContext.Consumer>
    );
  }
}

export default TeamViewer;
