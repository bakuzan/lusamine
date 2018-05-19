import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import ArtCard from 'components/ArtCard/ArtCard';
import { ClearButton, LeftButton, RightButton } from 'components/Buttons';
import TypeBlock from 'components/TypeBlock/TypeBlock';
import Orders from 'constants/orders';
import Party from 'constants/party';
import { capitaliseEachWord } from 'utils/common';

import './TeamMember.css';

class TeamMember extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleMove = this.handleMove.bind(this);
  }

  handleMove(direction) {
    return e => {
      e.stopPropagation();
      this.props.move(this.props.data.id, direction);
    };
  }

  render() {
    const {
      index,
      data,
      isSelected,
      onClick,
      remove,
      move,
      partyEndIndex
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
          'team-member--empty': !hasData
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
          {data.types.map(type => (
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
  onClick: PropTypes.func,
  remove: PropTypes.func,
  move: PropTypes.func,
  partyEndIndex: PropTypes.number
};

export default TeamMember;
