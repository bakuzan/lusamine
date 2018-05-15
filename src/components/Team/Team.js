import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import TeamMember from 'components/TeamMember/TeamMember';
import { padPartyWithEmptySlots } from 'utils/derived-data';
import { iterateMapToArray, iterateKeysToArray } from 'utils/common';

class Team extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyMembers: padPartyWithEmptySlots([]),
      members: new Map([])
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const members = iterateKeysToArray(nextProps.members);
    const oldMembers = iterateKeysToArray(prevState.members);

    if (members !== oldMembers) {
      return { members: nextProps.members };
    }

    return null;
  }

  padPartyToSixMembers(members) {
    const emptys = iterateMapToArray(this.state.emptyMembers);
    const memArr = iterateMapToArray(members);
    return [...memArr, ...emptys].slice(0, 6);
  }

  render() {
    const members = this.padPartyToSixMembers(this.state.members);
    console.log('TEAM', members);
    return (
      <section className="team">
        <List
          items={members}
          itemTemplate={item => <TeamMember key={item.id} data={item} />}
        />
      </section>
    );
  }
}

Team.propTypes = {
  members: PropTypes.object
};

export default Team;
