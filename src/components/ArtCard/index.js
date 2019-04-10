import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { capitaliseEachWord } from 'utils/common';
import { buildSelectorsForArtCard } from 'utils/selectors';

import './ArtCard.scss';

function ArtCard({ className, data }) {
  const backgroundPosition = data.artPosition;
  const artCardClasses = buildSelectorsForArtCard(data);

  return (
    <div className={classNames('art-card', artCardClasses.types)}>
      <div
        className={classNames(
          'art-card__pokemon',
          className,
          artCardClasses.name
        )}
        style={backgroundPosition}
        aria-label={capitaliseEachWord(
          `${data.name}${
            data.form ? ` (${capitaliseEachWord(data.form)})` : ''
          }`
        )}
      />
    </div>
  );
}

ArtCard.propTypes = {
  data: PropTypes.object
};

export default ArtCard;
