import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { DndProvider } from 'react-dnd';

import { getBackend } from '../DragAndDrop';
import List from 'components/List';
import TeamBreakdown from 'components/TeamBreakdown';
import TeamMember, { TeamMemberDraggable } from 'components/TeamMember';
import { generateEmptySlots } from 'utils/derivedData';
import {
  iterateMapToArray,
  iterateKeysToArray,
  swapArrayPositions,
  moveToNewArrayPosition,
  settingsStore
} from 'utils/common';

import './Team.scss';

const DNDBackend = getBackend();

const highlightDefaultState = {
  dataType: null,
  dataId: null,
  memberIds: []
};

class Team extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emptyMembers: generateEmptySlots(),
      members: new Map([]),
      settings: settingsStore.get(),
      highlight: { ...highlightDefaultState }
    };

    this.handleMemberRemove = this.handleMemberRemove.bind(this);
    this.handleMemberMove = this.handleMemberMove.bind(this);
    this.handleMemberEvolve = this.handleMemberEvolve.bind(this);
    this.handleMemberDnD = this.handleMemberDnD.bind(this);
    this.handleMouseState = this.handleMouseState.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const members = iterateKeysToArray(nextProps.members);
    const oldMembers = iterateKeysToArray(prevState.members);

    if (members !== oldMembers) {
      return {
        members: nextProps.members
      };
    }

    return null;
  }

  padPartyToSixMembers(members) {
    const emptys = iterateMapToArray(this.state.emptyMembers);
    const memArr = iterateMapToArray(members);
    return [...memArr, ...emptys].slice(0, 6);
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

  handleMemberEvolve(dataId, evolveToId) {
    const members = iterateKeysToArray(this.state.members);
    const newMembers = members.map((x) => (x === dataId ? evolveToId : x));
    const memberIds = new Set(newMembers);
    this.props.onMembersUpdate(memberIds);
  }

  handleMemberDnD(dragIndex, hoverIndex) {
    if (dragIndex === hoverIndex) {
      return; // ignore these
    }

    const members = iterateKeysToArray(this.state.members);
    const newOrderMembers = moveToNewArrayPosition(
      members,
      dragIndex,
      hoverIndex
    );
    const memberIds = new Set(newOrderMembers);
    this.props.onMembersUpdate(memberIds);
  }

  handleMouseState(dataType, dataId, memberIds) {
    this.setState((prev) => {
      const isSame =
        prev.highlight.dataType === dataType &&
        prev.highlight.dataId === dataId;

      return isSame
        ? { highlight: { ...highlightDefaultState } }
        : { highlight: { dataType, dataId, memberIds } };
    });
  }

  render() {
    const { highlight, settings } = this.state;

    const highlightMembers = highlight.memberIds;
    const lastMemberIndex = this.state.members.size - 1;
    const members = this.padPartyToSixMembers(this.state.members);

    const canRemove = !!this.props.onMembersUpdate;
    const canReOrder = !!this.props.onMembersUpdate;
    const canEvolve = !!this.props.onMembersUpdate && settings.canEvolve;

    const removeMember = canRemove ? this.handleMemberRemove : null;
    const evolveMember = canEvolve ? this.handleMemberEvolve : null;
    const moveMember =
      canReOrder && settings.canUseArrows ? this.handleMemberMove : null;
    const [moveMemberDnD, Member] =
      canReOrder && settings.canDragAndDrop
        ? [this.handleMemberDnD, TeamMemberDraggable]
        : [null, TeamMember];

    return (
      <DndProvider backend={DNDBackend} context={window}>
        <div>
          {this.props.name && (
            <div className="team-name">{this.props.name}</div>
          )}
          <List
            className={classNames('team')}
            items={members}
            itemTemplate={(item, i) => (
              <Member
                key={item.id}
                index={i}
                partyEndIndex={lastMemberIndex}
                data={item}
                isHighlighted={highlightMembers.includes(item.id)}
                remove={removeMember}
                move={moveMember}
                moveDnD={moveMemberDnD}
                evolve={evolveMember}
              />
            )}
          />
          <TeamBreakdown
            teamName={`team ${this.props.name || 'nameless'}`}
            members={this.state.members}
            onMouseState={this.handleMouseState}
          />
        </div>
      </DndProvider>
    );
  }
}

Team.propTypes = {
  name: PropTypes.string,
  types: PropTypes.object.isRequired,
  members: PropTypes.object,
  onMembersUpdate: PropTypes.func
};

export default Team;
