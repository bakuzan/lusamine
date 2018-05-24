import React from 'react';

import TeamViewerMessage from 'views/TeamViewer/TeamViewerMessage';
import { getSavedTeams } from 'utils/common';

class TeamViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedTeams: false,
      savedTeams: null
    };
  }

  componentDidMount() {
    this.setState({
      loadedTeams: true,
      savedTeams: getSavedTeams()
    });
  }

  render() {
    const { savedTeams } = this.state;
    if (this.state.loadedTeams && !savedTeams) return <TeamViewerMessage />;

    const teams = Object.keys(savedTeams).map(k => savedTeams[k].split(','));

    console.log('render viewer > ', teams, savedTeams);
    return <div className="team-viewer" />;
  }
}

export default TeamViewer;
