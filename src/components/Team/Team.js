import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import TeamMember from 'components/TeamMember/TeamMember';
import { MAX_PARTY_SIZE } from 'constants/misc';
import { padPartyWithEmptySlots } from 'utils/derived-data';

class Team extends React.Component {
  padMembersIfNotFull() {
    const { members } = this.props;
    if (members.length === MAX_PARTY_SIZE) return members;
    return padPartyWithEmptySlots(members);
  }

  render() {
    const members = this.padMembersIfNotFull();
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
  members: PropTypes.arrayOf(PropTypes.object)
};

export default Team;
