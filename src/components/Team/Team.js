import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import List from 'components/List/List';
import TeamBreakdown from 'components/TeamBreakdown/TeamBreakdown';
import TeamMember from 'components/TeamMember/TeamMember';
import { generateEmptySlots } from 'utils/derived-data';
import {
  iterateMapToArray,
  iterateKeysToArray,
  swapArrayPositions
} from 'utils/common';

import './Team.css';

class Team extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyMembers: generateEmptySlots(),
      members: new Map([]),
      selectedMemberId: null
    };

    this.handleMemberSelect = this.handleMemberSelect.bind(this);
    this.handleMemberRemove = this.handleMemberRemove.bind(this);
    this.handleMemberMove = this.handleMemberMove.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const members = iterateKeysToArray(nextProps.members);
    const oldMembers = iterateKeysToArray(prevState.members);

    if (members !== oldMembers) {
      return {
        members: nextProps.members,
        selectedMemberId: members.includes(prevState.selectedMemberId)
          ? prevState.selectedMemberId
          : null
      };
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

  handleMemberRemove(dataId) {
    const members = new Map([...this.state.members.entries()]);
    members.delete(dataId);
    const memberIds = new Set(iterateKeysToArray(members));
    this.props.onMembersUpdate(memberIds);
  }

  handleMemberMove(dataId, direction) {
    const members = iterateKeysToArray(this.state.members);
    const oldIndex = members.findIndex(x => x === dataId);
    const newIndex = oldIndex + direction;
    const newOrderMembers = swapArrayPositions(members, oldIndex, newIndex);
    const memberIds = new Set(newOrderMembers);
    this.props.onMembersUpdate(memberIds);
  }

  render() {
    const lastMemberIndex = this.state.members.size - 1;
    const members = this.padPartyToSixMembers(this.state.members);
    const canRemove = !!this.props.onMembersUpdate;
    const canReOrder = !!this.props.onMembersUpdate;
    console.log('TEAM', members);
    return (
      <div>
        <List
          className={classNames('team')}
          items={members}
          itemTemplate={(item, i) => (
            <TeamMember
              key={item.id}
              index={i}
              partyEndIndex={lastMemberIndex}
              data={item}
              isSelected={this.state.selectedMemberId === item.id}
              onClick={this.handleMemberSelect}
              remove={canRemove && this.handleMemberRemove}
              move={canReOrder && this.handleMemberMove}
            />
          )}
        />
        <TeamBreakdown members={this.state.members} />
      </div>
    );
  }
}

Team.propTypes = {
  members: PropTypes.object,
  onMembersUpdate: PropTypes.func
};

export default Team;
