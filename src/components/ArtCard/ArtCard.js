import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { buildSelectorsForArtCard } from 'utils/selectors';

const ArtCard = props => {
  console.log('ART CARD', props);
  const artCardClasses = buildSelectorsForArtCard(props.data);
  return (
    <div className={classNames('art-card', artCardClasses.types)}>
      <div className={classNames('art-card__pokemon', artCardClasses.name)} />
    </div>
  );
};

ArtCard.propTypes = {
  data: PropTypes.object
};

export default ArtCard;
