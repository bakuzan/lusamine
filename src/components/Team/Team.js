import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import DragAndDropContext from 'components/DragAndDrop';
import List from 'components/List/List';
import TeamBreakdown from 'components/TeamBreakdown/TeamBreakdown';
import TeamMember, {
  TeamMemberDraggable
} from 'components/TeamMember/TeamMember';
import { generateEmptySlots } from 'utils/derived-data';
import {
  iterateMapToArray,
  iterateKeysToArray,
  swapArrayPositions,
  moveToNewArrayPosition,
  getSettings
} from 'utils/common';
import highlighter from './HighlightMemberService';

import './Team.scss';

class Team extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyMembers: generateEmptySlots(),
      members: new Map([]),
      selectedMemberId: null,
      settings: getSettings(),
      highlightArgs: {}
    };

    this.handleMemberSelect = this.handleMemberSelect.bind(this);
    this.handleMemberRemove = this.handleMemberRemove.bind(this);
    this.handleMemberMove = this.handleMemberMove.bind(this);
    this.handleMemberDnD = this.handleMemberDnD.bind(this);
    this.handleMouseState = this.handleMouseState.bind(this);
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
    const oldIndex = members.findIndex((x) => x === dataId);
    const newIndex = oldIndex + direction;
    const newOrderMembers = swapArrayPositions(members, oldIndex, newIndex);
    const memberIds = new Set(newOrderMembers);
    this.props.onMembersUpdate(memberIds);
  }

  handleMemberDnD(dragIndex, hoverIndex) {
    const members = iterateKeysToArray(this.state.members);
    const newOrderMembers = moveToNewArrayPosition(
      members,
      dragIndex,
      hoverIndex
    );
    const memberIds = new Set(newOrderMembers);
    this.props.onMembersUpdate(memberIds);
  }

  handleMouseState(dataType, dataId) {
    this.setState((prev) => {
      const isSame =
        prev.highlightArgs.dataType === dataType &&
        prev.highlightArgs.dataId === dataId;

      return isSame
        ? { highlightArgs: {} }
        : { highlightArgs: { dataType, dataId } };
    });
  }

  render() {
    const { highlightArgs, settings } = this.state;
    const lastMemberIndex = this.state.members.size - 1;
    const members = this.padPartyToSixMembers(this.state.members);

    const canRemove = !!this.props.onMembersUpdate;
    const canReOrder = !!this.props.onMembersUpdate;

    const removeMember = canRemove ? this.handleMemberRemove : null;
    const moveMember = canReOrder ? this.handleMemberMove : null;
    const [moveMemberDnD, Member] =
      canReOrder && settings.canDragAndDrop
        ? [this.handleMemberDnD, TeamMemberDraggable]
        : [null, TeamMember];

    const highlightMembers = highlighter
      .withTypes(this.props.types)
      .forMembers(this.state.members)
      .withGroup(highlightArgs.dataType)
      .selectMembers(highlightArgs.dataId);

    return (
      <div>
        <List
          className={classNames('team')}
          items={members}
          itemTemplate={(item, i) => (
            <Member
              key={item.id}
              index={i}
              partyEndIndex={lastMemberIndex}
              data={item}
              isSelected={this.state.selectedMemberId === item.id}
              isHighlighted={highlightMembers.includes(item.id)}
              onClick={this.handleMemberSelect}
              remove={removeMember}
              move={moveMember}
              moveDnD={moveMemberDnD}
            />
          )}
        />
        <TeamBreakdown
          members={this.state.members}
          onMouseState={this.handleMouseState}
        />
      </div>
    );
  }
}

Team.propTypes = {
  types: PropTypes.object,
  members: PropTypes.object,
  onMembersUpdate: PropTypes.func
};

export default DragAndDropContext(Team);
