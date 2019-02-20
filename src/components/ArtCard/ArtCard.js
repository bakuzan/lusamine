import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { buildSelectorsForArtCard } from 'utils/selectors';

import './ArtCard.scss';

class ArtCard extends React.PureComponent {
  render() {
    const backgroundPosition = this.props.data.artPosition;
    const artCardClasses = buildSelectorsForArtCard(this.props.data);
    return (
      <div className={classNames('art-card', artCardClasses.types)}>
        <div
          className={classNames(
            'art-card__pokemon',
            this.props.className,
            artCardClasses.name
          )}
          style={backgroundPosition}
        />
      </div>
    );
  }
}

ArtCard.propTypes = {
  data: PropTypes.object
};

export default ArtCard;
