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
    console.log(this.state);

    if (this.state.loadedTeams && !this.state.savedTeams)
      return <TeamViewerMessage />;

    return <div className="team-viewer">saved team page</div>;
  }
}

export default TeamViewer;
