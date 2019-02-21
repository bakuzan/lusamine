import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ArtCard from 'components/ArtCard/ArtCard';
import { ClearButton, LeftButton, RightButton } from 'components/Buttons';
import { withDragAndDrop } from 'components/DragAndDrop';
import TypeBlock from 'components/TypeBlock/TypeBlock';
import Orders from 'constants/orders';
import Party from 'constants/party';
import { capitaliseEachWord, objectsAreEqual } from 'utils/common';

import './TeamMember.scss';

class TeamMember extends React.Component {
  constructor(props) {
    super(props);

    this.handleMove = this.handleMove.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const isDraggingChanged = nextProps.isDragging !== this.props.isDragging;
    const isOverChanged = nextProps.isOver !== this.props.isOver;
    const isSelectedChanged = nextProps.isSelected !== this.props.isSelected;
    const isHighlightedChanged =
      nextProps.isHighlighted !== this.props.isHighlighted;
    const indexChanged = nextProps.index !== this.props.index;
    const partyEndIndexChanged =
      nextProps.partyEndIndex !== this.props.partyEndIndex;
    const dataChanged = !objectsAreEqual(nextProps.data, this.props.data);

    return (
      isDraggingChanged ||
      isOverChanged ||
      isSelectedChanged ||
      isHighlightedChanged ||
      dataChanged ||
      indexChanged ||
      partyEndIndexChanged
    );
  }

  handleMove(direction) {
    return (e) => {
      e.stopPropagation();
      this.props.move(this.props.data.id, direction);
    };
  }

  render() {
    const {
      index,
      data,
      isSelected,
      isHighlighted,
      onClick,
      remove,
      move,
      partyEndIndex,
      isDragging,
      isOver,
      canDrop
    } = this.props;
    const hasData = !data.isEmpty;
    const canRemove = hasData && isSelected && !!remove;
    const canReOrder = hasData && isSelected && !!move;
    const notFirst = index !== Party.START_INDEX;
    const notLast = index !== partyEndIndex;
    const memberClick = hasData ? () => onClick(data.id) : null;

    return (
      <li
        id={data.id}
        className={classNames('team-member', {
          'team-member--selected': isSelected,
          'team-member--highlighted': isHighlighted,
          'team-member--empty': !hasData,
          'team-member--dragging': isDragging,
          'team-member--is-over': isOver && canDrop
        })}
        onClick={memberClick}
        role="button"
      >
        <div className={classNames('team-member__clear-container')}>
          {canRemove && (
            <ClearButton title="Remove" onClick={() => remove(data.id)} />
          )}
        </div>
        <ArtCard
          className={classNames({ 'team-member__art': hasData })}
          data={data}
        />
        <div className={classNames('team-member__name-bubble')}>
          {capitaliseEachWord(data.name)}
        </div>
        <div className={classNames('team-member__types')}>
          {data.types.map((type) => (
            <TypeBlock key={type.id} value={type.name} />
          ))}
        </div>
        <div className={classNames('team-member__order-container')}>
          {canReOrder &&
            notFirst && (
              <LeftButton
                title="Move Left"
                onClick={this.handleMove(Orders.moveLeft)}
              />
            )}
          {canReOrder &&
            notLast && (
              <RightButton
                title="Move Right"
                onClick={this.handleMove(Orders.moveRight)}
              />
            )}
        </div>
      </li>
    );
  }
}

TeamMember.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
  remove: PropTypes.func,
  move: PropTypes.func,
  partyEndIndex: PropTypes.number
};

export default TeamMember;
export const TeamMemberDraggable = withDragAndDrop(TeamMember);
