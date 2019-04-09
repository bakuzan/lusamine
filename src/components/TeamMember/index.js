import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useState, useContext, useMemo } from 'react';

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
import List from 'components/List';
import Orders from 'constants/orders';
import Party from 'constants/party';
import { PokedexContext } from 'context';
import { capitaliseEachWord } from 'utils/common';
import generateEvolutionOptions from './generateEvolutionOptions';
import pokeball from 'assets/pokeball.png';

import './TeamMember.scss';

const TeamMember = React.memo(
  React.forwardRef(function TeamMember(
    {
      index,
      partyEndIndex,
      data,
      isHighlighted,
      isDragging,
      isOver,
      remove,
      move,
      evolve,
      canDrop,
      ...props
    },
    ref
  ) {
    const pokedex = useContext(PokedexContext);
    const [displayEvolveMenu, setDisplayEvolveMenu] = useState(false);

    const hasData = !data.isEmpty;
    const canRemove = hasData && !!remove;
    const canReOrder = hasData && !!move;
    const canEvolve = hasData && !!evolve;
    const isFirst = index === Party.START_INDEX;
    const isLast = index === partyEndIndex;

    const evolutions = useMemo(() => generateEvolutionOptions(pokedex, data), [
      data.id
    ]);
    const disableEvolve = evolutions.length === 0;

    if (displayEvolveMenu) {
      console.log(evolutions);
      return (
        <li
          ref={ref}
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
              title="Back to member card"
              aria-label="Back to member card"
              onClick={() => setDisplayEvolveMenu(false)}
            />
          </div>
          <List
            columns={1}
            items={evolutions}
            itemTemplate={([text, x]) => {
              return (
                <li key={x.id}>
                  <Button
                    className="team-member__evolution-button"
                    aria-label={`${text} ${x.name}`}
                    onClick={() => evolve(data.id, x.id)}
                  >
                    {`${text} #${x.nationalPokedexNumber} ${capitaliseEachWord(
                      x.name
                    )}`}
                  </Button>
                </li>
              );
            }}
          />
        </li>
      );
    }

    return (
      <li
        ref={ref}
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
              title="Remove member from team"
              aria-label="Remove member from team"
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
              onClick={() => move(data.id, Orders.moveLeft)}
            />
          )}
          {canEvolve && (
            <Button
              className="team-member__action team-member__evolve"
              title="Open evolve member list"
              aria-label="Open evolve member list"
              disabled={disableEvolve}
              onClick={() => setDisplayEvolveMenu(true)}
            >
              <img src={pokeball} alt="pokeball" width={24} height={24} />
            </Button>
          )}
          {canReOrder && (
            <RightButton
              className="team-member__action"
              disabled={isLast}
              onClick={() => move(data.id, Orders.moveRight)}
            />
          )}
        </div>
      </li>
    );
  })
);

TeamMember.propTypes = {
  data: PropTypes.object.isRequired,
  isHighlighted: PropTypes.bool,
  remove: PropTypes.func,
  move: PropTypes.func,
  partyEndIndex: PropTypes.number
};

export default TeamMember;
export const TeamMemberDraggable = withDragAndDrop(TeamMember);
