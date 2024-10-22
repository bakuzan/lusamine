import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'ayaka/capitalise';
import { Button } from 'meiko/Button';
import ArtCard from 'components/ArtCard';

import './PokemonContent.scss';

const COLLAPSED_PROPS = {
  'aria-label': 'Click to collapse pokemon breakdown',
  title: 'Collapse',
  icon: '-'
};

const EXPANDED_PROPS = {
  'aria-label': 'Click to expand pokemon breakdown',
  title: 'Expand',
  icon: '+'
};

function PokemonContent({ data, isExpanded = false, onToggle = null }) {
  const hasToggle = !!onToggle;
  const expandProps = isExpanded ? COLLAPSED_PROPS : EXPANDED_PROPS;

  return (
    <div
      className={classNames('pokemon-content', {
        'pokemon-content--no-toggle': !hasToggle
      })}
    >
      {hasToggle && (
        <Button
          className="team-statistics__toggler"
          {...expandProps}
          onClick={onToggle}
        />
      )}
      <div>
        <ArtCard containerClass="team-statistics__card" data={data} />
        <div>{capitaliseEachWord(data.name)}</div>
      </div>
    </div>
  );
}

PokemonContent.propTypes = {
  isExpanded: PropTypes.bool,
  data: PropTypes.object.isRequired,
  onToggle: PropTypes.func
};

export default PokemonContent;
