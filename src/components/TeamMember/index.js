import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useState, useContext, useMemo } from 'react';

import { capitaliseEachWord } from 'ayaka/capitalise';
import generateUniqueId from 'ayaka/generateUniqueId';
import Icons from 'meiko/constants/icons';
import ArtCard from 'components/ArtCard';
import {
  ClearButton,
  LeftButton,
  RightButton,
  Button,
  IconButton,
  ButtonisedNavLink
} from 'components/Buttons';
import { withDragAndDropHooks } from 'components/DragAndDrop';
import TypeBlock from 'components/TypeBlock';
import List from 'components/List';
import Routes from 'constants/routes';
import Orders from 'constants/orders';
import Party from 'constants/party';
import { PokedexContext } from 'context';

import generateEvolutionOptions from 'utils/generateEvolutionOptions';
import { isNotBasePokemon } from 'utils/derivedData';
import pokeball from 'assets/pokeball.png';

import './TeamMember.scss';

const TeamMember = React.forwardRef(function TeamMember(
  {
    className,
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
  const { pokedex } = useContext(PokedexContext);
  const [memberId] = useState(() => `${data.id}_${generateUniqueId()}`);
  const [displayEvolveMenu, setDisplayEvolveMenu] = useState(false);

  const hasData = !data.isEmpty;
  const hasCustomActions = !!props.renderCustomActions;
  const canRemove = hasData && !!remove;
  const canReOrder = hasData && !!move;
  const canEvolve = hasData && !!evolve;

  const isFirst = index === Party.START_INDEX;
  const isLast = index === partyEndIndex;

  const evolutions = useMemo(
    () => generateEvolutionOptions(pokedex, data),
    [pokedex, data]
  );
  const disableEvolve = evolutions.count() === 0;

  if (displayEvolveMenu) {
    return (
      <li
        ref={ref}
        id={memberId}
        className={classNames(
          'team-member',
          {
            'team-member--highlighted': isHighlighted,
            'team-member--empty': !hasData,
            'team-member--dragging': isDragging,
            'team-member--is-over': isOver && canDrop
          },
          className
        )}
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
          items={evolutions.asList()}
          itemTemplate={([text, x]) => {
            const num = x.nationalPokedexNumber;
            const form = x.form ? ` (${capitaliseEachWord(x.form)})` : '';
            const fullName = capitaliseEachWord(`${x.name}${form}`);
            const evolveTarget = `${text} #${num} ${fullName}`;

            return (
              <li key={x.id}>
                <Button
                  className="team-member__evolution-button"
                  aria-label={`${text} ${x.name}`}
                  onClick={() => evolve(data.id, x.id)}
                >
                  {evolveTarget}
                </Button>
              </li>
            );
          }}
        />
      </li>
    );
  }

  const idSource = isNotBasePokemon(data)
    ? `p_${data.nationalPokedexNumber}`
    : data.id;

  const pokedexUrl = `${Routes.base}${Routes.pokedex}/${idSource}`;

  return (
    <li
      ref={ref}
      id={memberId}
      data-handler-id={props.handlerId}
      className={classNames(
        'team-member',
        {
          'team-member--highlighted': isHighlighted,
          'team-member--empty': !hasData,
          'team-member--dragging': isDragging,
          'team-member--is-over': isOver && canDrop
        },
        className
      )}
    >
      <div className={classNames('team-member__clear-container')}>
        {hasData && (
          <div
            className={classNames('team-member__npn', {
              'team-member__npn--with-remove': canRemove
            })}
          >
            <p
              id={`pokedexDescription_${memberId}`}
              className="for-screenreader-only"
            >
              Click the national pokedex number of{' '}
              {capitaliseEachWord(data.name)} to go to the corresponding pokedex
              page.
            </p>
            <ButtonisedNavLink
              className="team-member__pokedex-link"
              to={pokedexUrl}
              aria-describedby={`pokedexDescription_${memberId}`}
            >
              {`#${data.nationalPokedexNumber}`}
            </ButtonisedNavLink>
          </div>
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
      <div
        className={classNames('team-member__action-container')}
        aria-describedby={`memberActions_${memberId}`}
      >
        <p id={`memberActions_${memberId}`} className="for-screenreader-only">
          Here are a range of team member actions including the ability to move
          the team member left or right in the team, and evolve/devolve the team
          member. These actions can be enabled/disabled in the settings page.
        </p>
        {hasCustomActions && props.renderCustomActions({ data })}
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
});

TeamMember.propTypes = {
  index: PropTypes.number,
  className: PropTypes.string,
  data: PropTypes.object.isRequired,
  isDragging: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  isOver: PropTypes.bool,
  handlerId: PropTypes.string,
  canDrop: PropTypes.bool,
  evolve: PropTypes.func,
  remove: PropTypes.func,
  move: PropTypes.func,
  partyEndIndex: PropTypes.number,
  renderCustomActions: PropTypes.func
};

export default TeamMember;
export const TeamMemberDraggable = withDragAndDropHooks(TeamMember);
