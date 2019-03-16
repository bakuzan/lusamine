import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { Icons } from 'meiko-lib';
import ArtCard from 'components/ArtCard';
import {
  ClearButton,
  LeftButton,
  RightButton,
  Button,
  IconButton
} from 'components/Buttons';
import { withDragAndDrop } from 'components/DragAndDrop';
import TypeBlock from 'components/TypeBlock';
import Orders from 'constants/orders';
import Party from 'constants/party';
import { capitaliseEachWord } from 'utils/common';

import pokeball from 'assets/pokeball.png';

import './TeamMember.scss';

class TeamMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEvolveMenu: false
    };
  }

  // shouldComponentUpdate(nextProps) {
  //   const isDraggingChanged = nextProps.isDragging !== this.props.isDragging;
  //   const isOverChanged = nextProps.isOver !== this.props.isOver;
  //   const indexChanged = nextProps.index !== this.props.index;
  //   const dataChanged = !objectsAreEqual(nextProps.data, this.props.data);
  //   const isHighlightedChanged =
  //     nextProps.isHighlighted !== this.props.isHighlighted;
  //   const partyEndIndexChanged =
  //     nextProps.partyEndIndex !== this.props.partyEndIndex;

  //   return (
  //     isDraggingChanged ||
  //     isOverChanged ||
  //     isHighlightedChanged ||
  //     dataChanged ||
  //     indexChanged ||
  //     partyEndIndexChanged
  //   );
  // }

  render() {
    const { displayEvolveMenu } = this.state;
    const {
      index,
      data,
      isHighlighted,
      remove,
      move,
      evolve,
      partyEndIndex,
      isDragging,
      isOver,
      canDrop
    } = this.props;
    const hasData = !data.isEmpty;
    const canRemove = hasData && !!remove;
    const canReOrder = hasData && !!move;
    const canEvolve = hasData && !!evolve;
    const isFirst = index === Party.START_INDEX;
    const isLast = index === partyEndIndex;

    const evolutions = [];
    console.log('TEAM MEM >', this.props);

    if (displayEvolveMenu) {
      return (
        <li
          id={data.id}
          className={classNames('team-member', {
            'team-member--highlighted': isHighlighted,
            'team-member--empty': !hasData,
            'team-member--dragging': isDragging,
            'team-member--is-over': isOver && canDrop
          })}
        >
          <div className={classNames('team-member__back-container')}>
            <IconButton
              className="team-member__action back-button"
              icon={Icons.left}
              title="Back member"
              aria-label="Back member"
              onClick={() => this.setState({ displayEvolveMenu: false })}
            />
          </div>
          <ul>
            {evolutions.map((x) => {
              return (
                <li key={x.id}>
                  <Button onClick={() => evolve(data.id, x.id)}>
                    {`#${x.nationalPokedexNumber} ${x.name}`}
                  </Button>
                </li>
              );
            })}
          </ul>
        </li>
      );
    }

    return (
      <li
        id={data.id}
        className={classNames('team-member', {
          'team-member--highlighted': isHighlighted,
          'team-member--empty': !hasData,
          'team-member--dragging': isDragging,
          'team-member--is-over': isOver && canDrop
        })}
      >
        <div className={classNames('team-member__clear-container')}>
          {hasData && (
            <div
              className={classNames('team-member__npn', {
                'team-member__npn--with-remove': canRemove
              })}
            >{`#${data.nationalPokedexNumber}`}</div>
          )}
          {canRemove && (
            <ClearButton
              className="team-member__action"
              title="Remove member"
              aria-label="Remove member"
              onClick={() => remove(data.id)}
            />
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
          {canReOrder && (
            <LeftButton
              className="team-member__action"
              disabled={isFirst}
              onClick={() =>
                this.props.move(this.props.data.id, Orders.moveLeft)
              }
            />
          )}
          {canEvolve && (
            <Button
              className="team-member__action team-member__evolve"
              title="Evolve member"
              aria-label="Evolve member"
              onClick={() => this.setState({ displayEvolveMenu: true })}
            >
              <img src={pokeball} alt="pokeball" width={24} height={24} />
            </Button>
          )}
          {canReOrder && (
            <RightButton
              className="team-member__action"
              disabled={isLast}
              onClick={() =>
                this.props.move(this.props.data.id, Orders.moveRight)
              }
            />
          )}
        </div>
      </li>
    );
  }
}

TeamMember.propTypes = {
  data: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool,
  remove: PropTypes.func,
  move: PropTypes.func,
  partyEndIndex: PropTypes.number
};

export default TeamMember;
export const TeamMemberDraggable = withDragAndDrop(TeamMember);
