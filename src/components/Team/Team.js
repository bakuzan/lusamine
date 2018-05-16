import PropTypes from 'prop-types';
import React from 'react';

import List from 'components/List/List';
import TeamMember from 'components/TeamMember/TeamMember';
import { generateEmptySlots } from 'utils/derived-data';
import { iterateMapToArray, iterateKeysToArray } from 'utils/common';

class Team extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyMembers: generateEmptySlots(),
      members: new Map([]),
      selectedMemberId: null
    };

    this.handleMemberSelect = this.handleMemberSelect.bind(this);
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

  handleMemberSelect(dataId) {
    const selectedMemberId =
      this.state.selectedMemberId === dataId ? null : dataId;
    this.setState({ selectedMemberId });
  }

  render() {
    const members = this.padPartyToSixMembers(this.state.members);
    console.log('TEAM', members);
    return (
      <section>
        <List
          items={members}
          itemTemplate={item => (
            <TeamMember
              key={item.id}
              data={item}
              isSelected={this.state.selectedMemberId === item.id}
              onClick={this.handleMemberSelect}
            />
          )}
        />
      </section>
    );
  }
}

Team.propTypes = {
  members: PropTypes.object
};

export default Team;
